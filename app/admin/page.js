"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Copy,
  Eye,
  X,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  LogOut,
  Shield,
  RefreshCw,
  Download,
  FileJson,
  Undo2,
  Settings,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "@/utils/firebase";

// Admin emails from environment variable (comma-separated)
const ADMIN_EMAILS =
  process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [declinedReviews, setDeclinedReviews] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [previewConfig, setPreviewConfig] = useState(null);
  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState("pending");
  const [showTaskGateEditor, setShowTaskGateEditor] = useState(false);
  const [isSavingTaskgate, setIsSavingTaskgate] = useState(false);
  const [isLoadingTaskgate, setIsLoadingTaskgate] = useState(false);

  // TaskGate config state (loaded from Firestore)
  const [taskgateProvider, setTaskgateProvider] = useState(null);
  const [taskgateTasks, setTaskgateTasks] = useState([]);

  // Add new TaskGate task
  const addTaskgateTask = () => {
    const newTask = {
      id: `taskgate_task_${Date.now()}`,
      provider_id: "taskgate",
      display_name: "",
      description: "",
      type: "",
      difficulty: "easy",
      tags: [],
      platforms: ["android", "ios"],
    };
    setTaskgateTasks([...taskgateTasks, newTask]);
  };

  // Update TaskGate task
  const updateTaskgateTask = (index, field, value) => {
    const updated = [...taskgateTasks];
    updated[index] = { ...updated[index], [field]: value };
    setTaskgateTasks(updated);
  };

  // Remove TaskGate task
  const removeTaskgateTask = (index) => {
    if (taskgateTasks.length <= 1) return;
    setTaskgateTasks(taskgateTasks.filter((_, i) => i !== index));
  };

  // Load TaskGate config from Firestore
  const loadTaskgateConfig = async () => {
    setIsLoadingTaskgate(true);
    try {
      // Load provider
      const providerDoc = await getDoc(doc(db, "taskgate_config", "provider"));
      if (providerDoc.exists()) {
        setTaskgateProvider(providerDoc.data());
      } else {
        setTaskgateProvider(null);
      }

      // Load tasks
      const tasksDoc = await getDoc(doc(db, "taskgate_config", "tasks"));
      if (tasksDoc.exists() && tasksDoc.data().items) {
        setTaskgateTasks(tasksDoc.data().items);
      } else {
        setTaskgateTasks([]);
      }
    } catch (error) {
      console.error("Error loading TaskGate config:", error);
      showNotification("error", "Failed to load TaskGate config");
    } finally {
      setIsLoadingTaskgate(false);
    }
  };

  // Save TaskGate config to Firestore
  const saveTaskgateConfig = async (showSuccess = true) => {
    if (!taskgateProvider) return;
    setIsSavingTaskgate(true);
    try {
      // Save provider
      await setDoc(doc(db, "taskgate_config", "provider"), taskgateProvider);

      // Save tasks
      await setDoc(doc(db, "taskgate_config", "tasks"), {
        items: taskgateTasks,
        updated_at: new Date().toISOString(),
      });

      if (showSuccess) {
        showNotification("success", "TaskGate config saved");
      }
    } catch (error) {
      console.error("Error saving TaskGate config:", error);
      showNotification("error", "Failed to save TaskGate config");
    } finally {
      setIsSavingTaskgate(false);
    }
  };

  // Auto-save TaskGate config with debounce
  useEffect(() => {
    if (!taskgateProvider || isLoadingTaskgate) return;

    const timeoutId = setTimeout(() => {
      saveTaskgateConfig(false); // Auto-save without success notification
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [taskgateProvider, taskgateTasks]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setUser(currentUser);
      } else if (currentUser) {
        // Logged in but not an admin
        signOut(auth);
        setUser(null);
        setLoginError("Access denied. Admin privileges required.");
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch reviews when authenticated
  useEffect(() => {
    if (user) {
      fetchReviews();
      loadTaskgateConfig();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!ADMIN_EMAILS.includes(result.user.email)) {
        await signOut(auth);
        setLoginError("Access denied. Admin privileges required.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/invalid-credential") {
        setLoginError("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        setLoginError("Too many failed attempts. Please try again later.");
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const fetchReviews = async () => {
    setIsFetching(true);
    try {
      const reviewsCollection = collection(db, "approval_waitlist");
      const snapshot = await getDocs(reviewsCollection);

      const pending = [];
      const approved = [];
      const declined = [];

      snapshot.docs.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        if (data.declined) {
          declined.push(data);
        } else if (data.approved) {
          approved.push(data);
        } else {
          pending.push(data);
        }
      });

      // Sort by submitted_at (newest first)
      const sortByDate = (a, b) =>
        new Date(b.submitted_at) - new Date(a.submitted_at);

      setPendingReviews(pending.sort(sortByDate));
      setApprovedReviews(approved.sort(sortByDate));
      setDeclinedReviews(declined.sort(sortByDate));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      showNotification("error", "Failed to fetch reviews");
    } finally {
      setIsFetching(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = async (reviewId) => {
    setActionLoading((prev) => ({ ...prev, [reviewId]: "approve" }));
    try {
      const docRef = doc(db, "approval_waitlist", reviewId);
      await updateDoc(docRef, {
        approved: true,
        declined: false,
        approved_at: new Date().toISOString(),
        approved_by: user.email,
      });
      showNotification("success", `Approved: ${reviewId}`);
      await fetchReviews();
    } catch (error) {
      console.error("Error approving:", error);
      showNotification("error", "Failed to approve");
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: null }));
    }
  };

  const handleDecline = async (reviewId) => {
    setActionLoading((prev) => ({ ...prev, [reviewId]: "decline" }));
    try {
      const docRef = doc(db, "approval_waitlist", reviewId);
      await updateDoc(docRef, {
        approved: false,
        declined: true,
        declined_at: new Date().toISOString(),
        declined_by: user.email,
      });
      showNotification("success", `Declined: ${reviewId}`);
      await fetchReviews();
    } catch (error) {
      console.error("Error declining:", error);
      showNotification("error", "Failed to decline");
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: null }));
    }
  };

  const handleDelete = async (reviewId) => {
    if (
      !confirm(
        `Are you sure you want to delete ${reviewId}? This cannot be undone.`
      )
    ) {
      return;
    }
    setActionLoading((prev) => ({ ...prev, [reviewId]: "delete" }));
    try {
      const docRef = doc(db, "approval_waitlist", reviewId);
      await deleteDoc(docRef);
      showNotification("success", `Deleted: ${reviewId}`);
      await fetchReviews();
    } catch (error) {
      console.error("Error deleting:", error);
      showNotification("error", "Failed to delete");
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: null }));
    }
  };

  const handleMoveToPending = async (reviewId) => {
    setActionLoading((prev) => ({ ...prev, [reviewId]: "pending" }));
    try {
      const docRef = doc(db, "approval_waitlist", reviewId);
      await updateDoc(docRef, {
        approved: false,
        declined: false,
        declined_at: null,
        declined_by: null,
      });
      showNotification("success", `Moved to pending: ${reviewId}`);
      await fetchReviews();
    } catch (error) {
      console.error("Error moving to pending:", error);
      showNotification("error", "Failed to move to pending");
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: null }));
    }
  };

  const copyToClipboard = async (data) => {
    // Remove admin-specific fields for clean config
    const cleanConfig = { ...data };
    delete cleanConfig.approved;
    delete cleanConfig.declined;
    delete cleanConfig.submitted_at;
    delete cleanConfig.submitted_by;
    delete cleanConfig.approved_at;
    delete cleanConfig.approved_by;
    delete cleanConfig.declined_at;
    delete cleanConfig.declined_by;
    delete cleanConfig.id;

    try {
      await navigator.clipboard.writeText(JSON.stringify(cleanConfig, null, 2));
      showNotification("success", "JSON copied to clipboard");
    } catch (error) {
      showNotification("error", "Failed to copy");
    }
  };

  const toggleCardExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate complete production JSON from all approved reviews
  const generateCompleteJson = () => {
    const providers = taskgateProvider ? [taskgateProvider] : [];
    const allTasks = [...taskgateTasks];

    approvedReviews.forEach((review) => {
      // Add provider (without admin fields)
      if (review.provider) {
        providers.push({
          id: review.id,
          ...review.provider,
        });
      }

      // Add tasks
      if (review.tasks && Array.isArray(review.tasks)) {
        review.tasks.forEach((task) => {
          allTasks.push({
            ...task,
            provider_id: review.id,
          });
        });
      }
    });

    return {
      schema_version: 1,
      providers,
      tasks: allTasks,
      generated_at: new Date().toISOString(),
      total_providers: providers.length,
      total_tasks: allTasks.length,
    };
  };

  // Copy complete JSON to clipboard
  const copyCompleteJson = async () => {
    try {
      const completeJson = generateCompleteJson();
      await navigator.clipboard.writeText(
        JSON.stringify(completeJson, null, 2)
      );
      showNotification("success", "Complete JSON copied to clipboard");
    } catch (error) {
      showNotification("error", "Failed to copy");
    }
  };

  // Download complete JSON as file
  const downloadCompleteJson = () => {
    try {
      const completeJson = generateCompleteJson();
      const blob = new Blob([JSON.stringify(completeJson, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `taskgate-production-config-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification("success", "JSON file downloaded");
    } catch (error) {
      showNotification("error", "Failed to download");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Login form
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="admin@taskgate.io"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  const currentReviews =
    activeTab === "pending"
      ? pendingReviews
      : activeTab === "approved"
      ? approvedReviews
      : declinedReviews;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-500/90"
                : "bg-red-500/90"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-500" />
            <h1 className="text-xl font-bold">TaskGate Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={() => setShowTaskGateEditor(true)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
              title="Edit TaskGate Default Config"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">TaskGate</span>
            </button>
            {approvedReviews.length > 0 && (
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                title="Export Production JSON"
              >
                <FileJson className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={fetchReviews}
              disabled={isFetching}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "pending"
                ? "text-purple-400 border-purple-400"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending
              {pendingReviews.length > 0 && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  {pendingReviews.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "approved"
                ? "text-purple-400 border-purple-400"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved
              {approvedReviews.length > 0 && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                  {approvedReviews.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("declined")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "declined"
                ? "text-purple-400 border-purple-400"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Declined
              {declinedReviews.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                  {declinedReviews.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        {isFetching && currentReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading reviews...</p>
          </div>
        ) : currentReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">
              {activeTab === "pending" ? (
                <Clock className="w-12 h-12 mx-auto" />
              ) : activeTab === "approved" ? (
                <CheckCircle className="w-12 h-12 mx-auto" />
              ) : (
                <XCircle className="w-12 h-12 mx-auto" />
              )}
            </div>
            <p className="text-gray-400">No {activeTab} reviews</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750"
                  onClick={() => toggleCardExpand(review.id)}
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      {review.provider?.name || review.id}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      ID: <code className="text-purple-400">{review.id}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm hidden md:block">
                      {formatDate(review.submitted_at)}
                    </span>
                    {expandedCards[review.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedCards[review.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-700"
                    >
                      <div className="p-4">
                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <p className="text-gray-400 text-xs mb-1">
                              Submitted By
                            </p>
                            <p className="text-white">
                              {review.submitted_by || "Unknown"}
                            </p>
                          </div>
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <p className="text-gray-400 text-xs mb-1">
                              Submitted At
                            </p>
                            <p className="text-white">
                              {formatDate(review.submitted_at)}
                            </p>
                          </div>
                          {review.provider?.tagline && (
                            <div className="bg-gray-900/50 rounded-lg p-3 md:col-span-2">
                              <p className="text-gray-400 text-xs mb-1">
                                Tagline
                              </p>
                              <p className="text-white">
                                {review.provider.tagline}
                              </p>
                            </div>
                          )}

                          {/* App Icon Previews */}
                          {review.provider?.icon_path_light && (
                            <div className="bg-gray-900/50 rounded-lg p-4 md:col-span-2">
                              <p className="text-gray-400 text-xs mb-3">
                                App Icons
                              </p>
                              <div className="flex gap-8 flex-wrap">
                                {/* Light Mode */}
                                <div>
                                  <p className="text-gray-500 text-xs mb-2 text-center">
                                    Light Mode
                                  </p>
                                  <div className="flex gap-3 items-end">
                                    {/* Android */}
                                    <div className="text-center">
                                      <div
                                        className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-lg border border-gray-600"
                                        style={{
                                          backgroundColor: review.provider
                                            ?.icon_background_img_light
                                            ? "transparent"
                                            : review.provider
                                                ?.icon_background_color_light ||
                                              "#ffffff",
                                          backgroundImage: review.provider
                                            ?.icon_background_img_light
                                            ? `url(${review.provider.icon_background_img_light})`
                                            : "none",
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }}
                                      >
                                        {review.provider?.icon_path_light?.startsWith(
                                          "http"
                                        ) && (
                                          <img
                                            src={
                                              review.provider.icon_path_light
                                            }
                                            alt="Android"
                                            className="w-9 h-9 object-contain"
                                          />
                                        )}
                                      </div>
                                      <p className="text-gray-500 text-[10px] mt-1">
                                        Android
                                      </p>
                                    </div>
                                    {/* iOS */}
                                    <div className="text-center">
                                      <div
                                        className="w-14 h-14 rounded-[12px] overflow-hidden flex items-center justify-center shadow-lg border border-gray-600"
                                        style={{
                                          backgroundColor: review.provider
                                            ?.icon_background_img_light
                                            ? "transparent"
                                            : review.provider
                                                ?.icon_background_color_light ||
                                              "#ffffff",
                                          backgroundImage: review.provider
                                            ?.icon_background_img_light
                                            ? `url(${review.provider.icon_background_img_light})`
                                            : "none",
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }}
                                      >
                                        {review.provider?.icon_path_light?.startsWith(
                                          "http"
                                        ) && (
                                          <img
                                            src={
                                              review.provider.icon_path_light
                                            }
                                            alt="iOS"
                                            className="w-9 h-9 object-contain"
                                          />
                                        )}
                                      </div>
                                      <p className="text-gray-500 text-[10px] mt-1">
                                        iOS
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Dark Mode */}
                                <div>
                                  <p className="text-gray-500 text-xs mb-2 text-center">
                                    Dark Mode
                                  </p>
                                  <div className="flex gap-3 items-end">
                                    {/* Android */}
                                    <div className="text-center">
                                      <div
                                        className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-lg border border-gray-600"
                                        style={{
                                          backgroundColor: review.provider
                                            ?.icon_background_img_dark
                                            ? "transparent"
                                            : review.provider
                                                ?.icon_background_color_dark ||
                                              "#000000",
                                          backgroundImage: review.provider
                                            ?.icon_background_img_dark
                                            ? `url(${review.provider.icon_background_img_dark})`
                                            : "none",
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }}
                                      >
                                        <img
                                          src={
                                            review.provider?.icon_path_dark?.startsWith(
                                              "http"
                                            )
                                              ? review.provider.icon_path_dark
                                              : review.provider?.icon_path_light
                                          }
                                          alt="Android"
                                          className="w-9 h-9 object-contain"
                                        />
                                      </div>
                                      <p className="text-gray-500 text-[10px] mt-1">
                                        Android
                                      </p>
                                    </div>
                                    {/* iOS */}
                                    <div className="text-center">
                                      <div
                                        className="w-14 h-14 rounded-[12px] overflow-hidden flex items-center justify-center shadow-lg border border-gray-600"
                                        style={{
                                          backgroundColor: review.provider
                                            ?.icon_background_img_dark
                                            ? "transparent"
                                            : review.provider
                                                ?.icon_background_color_dark ||
                                              "#000000",
                                          backgroundImage: review.provider
                                            ?.icon_background_img_dark
                                            ? `url(${review.provider.icon_background_img_dark})`
                                            : "none",
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }}
                                      >
                                        <img
                                          src={
                                            review.provider?.icon_path_dark?.startsWith(
                                              "http"
                                            )
                                              ? review.provider.icon_path_dark
                                              : review.provider?.icon_path_light
                                          }
                                          alt="iOS"
                                          className="w-9 h-9 object-contain"
                                        />
                                      </div>
                                      <p className="text-gray-500 text-[10px] mt-1">
                                        iOS
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {review.tasks && (
                            <div className="bg-gray-900/50 rounded-lg p-3 md:col-span-2">
                              <p className="text-gray-400 text-xs mb-1">
                                Tasks ({review.tasks.length})
                              </p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {review.tasks.map((task, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                                  >
                                    {task.name || task.id}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {review.approved && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 md:col-span-2">
                              <p className="text-green-400 text-xs mb-1">
                                Approved
                              </p>
                              <p className="text-white text-sm">
                                By {review.approved_by} on{" "}
                                {formatDate(review.approved_at)}
                              </p>
                            </div>
                          )}
                          {review.declined && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 md:col-span-2">
                              <p className="text-red-400 text-xs mb-1">
                                Declined
                              </p>
                              <p className="text-white text-sm">
                                By {review.declined_by} on{" "}
                                {formatDate(review.declined_at)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                          <button
                            onClick={() => setPreviewConfig(review)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View JSON
                          </button>
                          <button
                            onClick={() => copyToClipboard(review)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Copy JSON
                          </button>
                          {activeTab === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(review.id)}
                                disabled={actionLoading[review.id]}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {actionLoading[review.id] === "approve" ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => handleDecline(review.id)}
                                disabled={actionLoading[review.id]}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {actionLoading[review.id] === "decline" ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                Decline
                              </button>
                            </>
                          )}
                          {activeTab === "declined" && (
                            <button
                              onClick={() => handleMoveToPending(review.id)}
                              disabled={actionLoading[review.id]}
                              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading[review.id] === "pending" ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                              ) : (
                                <Undo2 className="w-4 h-4" />
                              )}
                              Move to Pending
                            </button>
                          )}
                          {(activeTab === "approved" ||
                            activeTab === "declined") && (
                            <button
                              onClick={() => handleDelete(review.id)}
                              disabled={actionLoading[review.id]}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading[review.id] === "delete" ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-red-400"></div>
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* JSON Preview Modal */}
      <AnimatePresence>
        {previewConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewConfig(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="font-semibold text-lg">
                  Config: {previewConfig.id}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(previewConfig)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => setPreviewConfig(null)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="overflow-auto flex-1 p-4">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {JSON.stringify(
                    (() => {
                      const cleanConfig = { ...previewConfig };
                      delete cleanConfig.approved;
                      delete cleanConfig.declined;
                      delete cleanConfig.submitted_at;
                      delete cleanConfig.submitted_by;
                      delete cleanConfig.approved_at;
                      delete cleanConfig.approved_by;
                      delete cleanConfig.declined_at;
                      delete cleanConfig.declined_by;
                      delete cleanConfig.id;
                      return cleanConfig;
                    })(),
                    null,
                    2
                  )}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3 className="font-semibold text-lg">
                    Export Production Config
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {approvedReviews.length} providers,{" "}
                    {approvedReviews.reduce(
                      (sum, r) => sum + (r.tasks?.length || 0),
                      0
                    )}{" "}
                    tasks
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCompleteJson}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadCompleteJson}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="overflow-auto flex-1 p-4">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {JSON.stringify(generateCompleteJson(), null, 2)}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TaskGate Config Editor Modal */}
      <AnimatePresence>
        {showTaskGateEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTaskGateEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-lg">
                    TaskGate Default Config
                  </h3>
                </div>
                <button
                  onClick={() => setShowTaskGateEditor(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-auto flex-1 p-4 space-y-6">
                {isLoadingTaskgate ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : !taskgateProvider ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">
                      No TaskGate config found in database.
                    </p>
                    <button
                      onClick={() => {
                        setTaskgateProvider({
                          id: "",
                          name: "",
                          domain: "",
                          package_name_android: "",
                          package_name_ios: "",
                          app_store_id: "",
                          url_scheme: "",
                          icon_path_light: "",
                          icon_path_dark: "",
                          icon_background_color_light: "#ffffff",
                          icon_background_color_dark: "#1a1a1a",
                          icon_background_img_light: "",
                          icon_background_img_dark: "",
                        });
                        setTaskgateTasks([]);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      Create New Config
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Provider Section */}
                    <div>
                      <h4 className="text-md font-semibold text-purple-400 mb-3">
                        Provider
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            ID
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.id}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                id: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.name}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Domain
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.domain}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                domain: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            URL Scheme
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.url_scheme}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                url_scheme: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Package Name (Android)
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.package_name_android}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                package_name_android: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Package Name (iOS)
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.package_name_ios}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                package_name_ios: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            App Store ID
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.app_store_id}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                app_store_id: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Icon Path (Light)
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.icon_path_light}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                icon_path_light: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Icon Path (Dark)
                          </label>
                          <input
                            type="text"
                            value={taskgateProvider.icon_path_dark}
                            onChange={(e) =>
                              setTaskgateProvider({
                                ...taskgateProvider,
                                icon_path_dark: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Icon BG Color (Light)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={
                                taskgateProvider.icon_background_color_light
                              }
                              onChange={(e) =>
                                setTaskgateProvider({
                                  ...taskgateProvider,
                                  icon_background_color_light: e.target.value,
                                })
                              }
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={
                                taskgateProvider.icon_background_color_light
                              }
                              onChange={(e) =>
                                setTaskgateProvider({
                                  ...taskgateProvider,
                                  icon_background_color_light: e.target.value,
                                })
                              }
                              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Icon BG Color (Dark)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={
                                taskgateProvider.icon_background_color_dark
                              }
                              onChange={(e) =>
                                setTaskgateProvider({
                                  ...taskgateProvider,
                                  icon_background_color_dark: e.target.value,
                                })
                              }
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={
                                taskgateProvider.icon_background_color_dark
                              }
                              onChange={(e) =>
                                setTaskgateProvider({
                                  ...taskgateProvider,
                                  icon_background_color_dark: e.target.value,
                                })
                              }
                              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tasks Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-semibold text-purple-400">
                          Tasks ({taskgateTasks.length})
                        </h4>
                        <button
                          onClick={addTaskgateTask}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add Task
                        </button>
                      </div>

                      <div className="space-y-4">
                        {taskgateTasks.map((task, index) => (
                          <div
                            key={index}
                            className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-gray-400">
                                Task {index + 1}
                              </span>
                              {taskgateTasks.length > 1 && (
                                <button
                                  onClick={() => removeTaskgateTask(index)}
                                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                  title="Remove task"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                  Task ID
                                </label>
                                <input
                                  type="text"
                                  value={task.id}
                                  onChange={(e) =>
                                    updateTaskgateTask(
                                      index,
                                      "id",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                  Display Name
                                </label>
                                <input
                                  type="text"
                                  value={task.display_name}
                                  onChange={(e) =>
                                    updateTaskgateTask(
                                      index,
                                      "display_name",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={task.description}
                                  onChange={(e) =>
                                    updateTaskgateTask(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm resize-none"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                  Type
                                </label>
                                <input
                                  type="text"
                                  value={task.type}
                                  onChange={(e) =>
                                    updateTaskgateTask(
                                      index,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                  Difficulty
                                </label>
                                <select
                                  value={task.difficulty}
                                  onChange={(e) =>
                                    updateTaskgateTask(
                                      index,
                                      "difficulty",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                                >
                                  <option value="easy">Easy</option>
                                  <option value="medium">Medium</option>
                                  <option value="hard">Hard</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">
                                  Tags (press Enter to add)
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {task.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newTags = task.tags.filter(
                                            (_, i) => i !== tagIndex
                                          );
                                          updateTaskgateTask(
                                            index,
                                            "tags",
                                            newTags
                                          );
                                        }}
                                        className="hover:text-white"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Type a tag and press Enter"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const newTag = e.target.value.trim();
                                      if (
                                        newTag &&
                                        !task.tags.includes(newTag)
                                      ) {
                                        updateTaskgateTask(index, "tags", [
                                          ...task.tags,
                                          newTag,
                                        ]);
                                        e.target.value = "";
                                      }
                                    }
                                  }}
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-gray-400 mb-1">
                                  Platforms
                                </label>
                                <div className="flex gap-4">
                                  <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input
                                      type="checkbox"
                                      checked={task.platforms.includes(
                                        "android"
                                      )}
                                      onChange={(e) => {
                                        const newPlatforms = e.target.checked
                                          ? [...task.platforms, "android"]
                                          : task.platforms.filter(
                                              (p) => p !== "android"
                                            );
                                        updateTaskgateTask(
                                          index,
                                          "platforms",
                                          newPlatforms
                                        );
                                      }}
                                      className="rounded"
                                    />
                                    Android
                                  </label>
                                  <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input
                                      type="checkbox"
                                      checked={task.platforms.includes("ios")}
                                      onChange={(e) => {
                                        const newPlatforms = e.target.checked
                                          ? [...task.platforms, "ios"]
                                          : task.platforms.filter(
                                              (p) => p !== "ios"
                                            );
                                        updateTaskgateTask(
                                          index,
                                          "platforms",
                                          newPlatforms
                                        );
                                      }}
                                      className="rounded"
                                    />
                                    iOS
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                <button
                  onClick={() => setShowTaskGateEditor(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {isSavingTaskgate ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-purple-500"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Auto-saved</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
