"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  LogOut,
  ShieldX,
  Crop,
  ZoomIn,
  ZoomOut,
  Copy,
  Download,
} from "lucide-react";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/utils/firebase";
import { usePartnerAuth } from "@/contexts/PartnerAuthContext";

// Helper to generate short UUID
const generateShortUuid = () => Math.random().toString(36).substring(2, 8);

// Helper to sanitize name for ID
const sanitizeName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 30) || "untitled";

// Helper to generate task ID
const generateTaskId = (providerId, taskIndex) => {
  const sanitizedProvider = sanitizeName(providerId || "provider");
  const uuid = generateShortUuid();
  return `${sanitizedProvider}_task_${taskIndex}_${uuid}`;
};

// Helper to ensure tags is always an array
const ensureTagsArray = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  return [];
};

// Constants
const TASK_TYPES = [
  { value: "focus", label: "Focus" },
  { value: "meditation", label: "Meditation" },
  { value: "breathing", label: "Breathing" },
  { value: "exercise", label: "Exercise" },
  { value: "reading", label: "Reading" },
  { value: "journaling", label: "Journaling" },
  { value: "learning", label: "Learning" },
  { value: "others", label: "Others" },
];

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const PLATFORM_OPTIONS = [
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "both", label: "Both" },
];

// Helper to create empty task
const createEmptyTask = (providerId, index) => ({
  id: generateTaskId(providerId, index),
  type: "focus",
  display_name: "",
  description: "",
  difficulty: "medium",
  tags: [],
  platform: "both",
  isExpanded: true,
});

export default function PartnerConfigEditor() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.providerId;

  // Auth context
  const {
    user,
    partnerData,
    providerId: authProviderId,
    loading: authLoading,
    logout,
  } = usePartnerAuth();

  // Authorization state
  const [isAuthorized, setIsAuthorized] = useState(null);

  // Form state
  const [provider, setProvider] = useState({
    name: "",
    domain: "",
    package_name_android: "",
    package_name_ios: "",
    app_store_id: "",
    url_scheme: "",
    icon_path_light: "",
    icon_path_dark: "",
    icon_background_color_light: "#FFFFFF",
    icon_background_color_dark: "#000000",
    icon_background_img_light: "",
    icon_background_img_dark: "",
  });
  const [tasks, setTasks] = useState([createEmptyTask("", 1)]);

  // UI state
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isUploading, setIsUploading] = useState({
    light: false,
    dark: false,
    bgLight: false,
    bgDark: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isInitialLoad = useRef(true);
  const autoSaveTimeout = useRef(null);

  // Crop state
  const [cropModal, setCropModal] = useState({
    isOpen: false,
    imageSrc: null,
    field: null,
    aspectRatio: 1,
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const canvasRef = useRef(null);

  // Portal mount state (for SSR safety)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Approval status state
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [showApprovalConfig, setShowApprovalConfig] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "default", // "default" | "danger"
    onConfirm: null,
  });

  // Check authorization
  useEffect(() => {
    if (authLoading) return;

    // If no user logged in, redirect to login
    if (!user) {
      router.replace("/partner");
      return;
    }

    // Check if user's provider ID matches URL
    if (authProviderId !== providerId) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    // User is authorized
    setIsAuthorized(true);

    // Pre-fill provider name from partner data
    if (partnerData?.app_name) {
      setProvider((prev) => ({ ...prev, name: partnerData.app_name }));
      // Update initial task ID with the provider ID
      setTasks((prev) => {
        if (prev.length === 1 && !prev[0].display_name) {
          return [createEmptyTask(providerId, 1)];
        }
        return prev;
      });
    }

    // Load existing config
    loadExistingConfig();
  }, [authLoading, user, authProviderId, providerId, partnerData]);

  // Load existing config from Firestore
  const loadExistingConfig = async () => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "partner_configs_dev", providerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.provider) {
          setProvider(data.provider);
        }
        if (data.tasks && data.tasks.length > 0) {
          setTasks(
            data.tasks.map((task) => {
              // Convert platforms array to platform string for the form
              let platformValue = "both";
              if (task.platforms) {
                if (
                  task.platforms.length === 1 &&
                  task.platforms[0] === "ios"
                ) {
                  platformValue = "ios";
                } else if (
                  task.platforms.length === 1 &&
                  task.platforms[0] === "android"
                ) {
                  platformValue = "android";
                }
              } else if (task.platform) {
                // Handle old data that might have platform string
                platformValue = task.platform;
              }
              // Remove both platforms and platform from task, use computed platform instead
              const { platforms, platform, ...taskWithoutPlatforms } = task;
              return {
                ...taskWithoutPlatforms,
                platform: platformValue,
                isExpanded: false,
              };
            })
          );
        }
      }
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setIsLoading(false);
      // Mark initial load complete after a short delay
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 500);
    }
  };

  // Load approval status
  const loadApprovalStatus = async () => {
    if (!db) return;

    try {
      const docRef = doc(db, "approval_waitlist", providerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setApprovalStatus(docSnap.data());
      } else {
        setApprovalStatus(null);
      }
    } catch (error) {
      console.error("Error loading approval status:", error);
    }
  };

  // Load approval status on mount and after submission
  useEffect(() => {
    if (isAuthorized && db) {
      loadApprovalStatus();
    }
  }, [isAuthorized, db]);

  // Auto-save effect
  useEffect(() => {
    // Skip auto-save during initial load
    if (isInitialLoad.current || isLoading || !isAuthorized || !db) return;

    // Mark as having unsaved changes
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }

    // Set new timeout for auto-save (2 second debounce)
    autoSaveTimeout.current = setTimeout(() => {
      autoSave();
    }, 2000);

    // Cleanup
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, [provider, tasks]);

  // Auto-save function
  const autoSave = async () => {
    if (!db || !isAuthorized) return;

    setIsSaving(true);
    try {
      const config = generateConfig();
      const docRef = doc(db, "partner_configs_dev", providerId);
      await setDoc(docRef, config);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle file selection (opens crop modal)
  const handleFileSelect = (file, field) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({
        isOpen: true,
        imageSrc: reader.result,
        field,
        aspectRatio: 1, // Square for icons
      });
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create cropped image - crops selected area and scales to mobile size (512x512)
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Mobile icon size - 512x512 is good for both iOS and Android
    const mobileSize = 512;
    canvas.width = mobileSize;
    canvas.height = mobileSize;

    // Enable smooth scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped area scaled to mobile size
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      mobileSize,
      mobileSize
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/png",
        0.95
      );
    });
  };

  // Handle crop confirm - calculate crop based on position and zoom
  const handleCropConfirm = async () => {
    if (!cropModal.imageSrc) return;

    try {
      const image = new Image();
      image.src = cropModal.imageSrc;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      // Container and crop box dimensions
      const containerHeight = 320; // h-80 = 320px
      const cropBoxSize = 192; // w-48 h-48 = 192px

      // Calculate the base scale to fit image in container
      const baseScale = Math.min(
        containerHeight / image.height,
        containerHeight / image.width
      );

      // Total scale = baseScale * zoom
      const totalScale = baseScale * zoom;

      // The crop box is centered in the container
      // crop.x and crop.y represent how much the image has been moved
      // Negative crop.x means image moved left, so we're cropping more from the right

      // Calculate source coordinates in original image space
      const sourceSize = cropBoxSize / totalScale;
      const sourceCenterX = image.width / 2 - crop.x / totalScale;
      const sourceCenterY = image.height / 2 - crop.y / totalScale;

      const sourceX = sourceCenterX - sourceSize / 2;
      const sourceY = sourceCenterY - sourceSize / 2;

      // Clamp to image bounds
      const clampedX = Math.max(0, Math.min(sourceX, image.width - sourceSize));
      const clampedY = Math.max(
        0,
        Math.min(sourceY, image.height - sourceSize)
      );
      const clampedSize = Math.min(sourceSize, image.width, image.height);

      const pixelCrop = {
        x: Math.round(clampedX),
        y: Math.round(clampedY),
        width: Math.round(clampedSize),
        height: Math.round(clampedSize),
      };

      const croppedBlob = await getCroppedImg(cropModal.imageSrc, pixelCrop);
      const file = new File([croppedBlob], "cropped.png", {
        type: "image/png",
      });
      await handleFileUpload(file, cropModal.field);
      setCropModal({
        isOpen: false,
        imageSrc: null,
        field: null,
        aspectRatio: 1,
      });
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error("Error cropping image:", error);
      showNotification("error", "Failed to crop image");
    }
  };

  // Cancel crop
  const handleCropCancel = () => {
    setCropModal({
      isOpen: false,
      imageSrc: null,
      field: null,
      aspectRatio: 1,
    });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // Handle file upload
  const handleFileUpload = async (file, field) => {
    if (!storage) {
      showNotification("error", "Storage not available");
      return;
    }

    const uploadKeyMap = {
      icon_path_light: "light",
      icon_path_dark: "dark",
      icon_background_img_light: "bgLight",
      icon_background_img_dark: "bgDark",
    };
    const fileNameMap = {
      icon_path_light: "light",
      icon_path_dark: "dark",
      icon_background_img_light: "bg_light",
      icon_background_img_dark: "bg_dark",
    };
    const uploadKey = uploadKeyMap[field] || "light";
    setIsUploading((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const fileExtension = file.name.split(".").pop();
      const fileType = fileNameMap[field] || "icon";
      const fileName = `partners/${providerId}/icons/${fileType}.${fileExtension}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      updateProvider(field, downloadURL);
      showNotification("success", "Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      showNotification("error", "Failed to upload image");
    } finally {
      setIsUploading((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Handle image removal from storage
  const handleRemoveImage = async (field) => {
    const currentUrl = provider[field];

    // Clear the field first
    updateProvider(field, "");

    // If URL exists and is from our Firebase storage, delete the file
    if (currentUrl && storage && currentUrl.includes("firebase")) {
      const fileNameMap = {
        icon_background_img_light: "bg_light",
        icon_background_img_dark: "bg_dark",
      };
      const fileType = fileNameMap[field];

      if (fileType) {
        try {
          // Try to extract and delete the file
          // The URL format contains the path, we need to reconstruct it
          const filePath = `partners/${providerId}/icons/${fileType}`;

          // Try common extensions
          const extensions = ["png", "jpg", "jpeg", "webp", "gif"];
          for (const ext of extensions) {
            try {
              const storageRef = ref(storage, `${filePath}.${ext}`);
              await deleteObject(storageRef);
              showNotification("success", "Image removed");
              return;
            } catch (e) {
              // File with this extension doesn't exist, try next
            }
          }
        } catch (error) {
          console.error("Error removing file from storage:", error);
          // Field is already cleared, so just log the error
        }
      }
    }
  };

  // Validate form
  const validate = useCallback(() => {
    const newErrors = {};

    if (!provider.name?.trim()) {
      newErrors.providerName = "App Name is required";
    }
    if (!provider.domain?.trim()) {
      newErrors.providerDomain = "Domain is required";
    }

    // At least one package name required
    if (
      !provider.package_name_android?.trim() &&
      !provider.package_name_ios?.trim()
    ) {
      newErrors.packageName =
        "Either Android Package or iOS Package is required";
    }

    // At least one icon required
    if (!provider.icon_path_light && !provider.icon_path_dark) {
      newErrors.icon = "Either Light Mode or Dark Mode icon is required";
    }

    if (tasks.length === 0) {
      newErrors.tasks = "At least one task is required";
    }

    const taskIds = new Set();
    tasks.forEach((task, index) => {
      if (!task.display_name?.trim()) {
        newErrors[`task_${index}_display_name`] = "Display Name is required";
      }
      if (!task.description?.trim() || task.description.trim().length < 10) {
        newErrors[`task_${index}_description`] =
          "Description is required (at least 10 characters)";
      }
      if (!task.platform) {
        newErrors[`task_${index}_platform`] = "Platform is required";
      }
      if (taskIds.has(task.id)) {
        newErrors[`task_${index}_id`] = "Task ID must be unique";
      }
      taskIds.add(task.id);
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [provider, tasks]);

  // Update provider field
  const updateProvider = (field, value) => {
    setProvider((prev) => ({ ...prev, [field]: value }));
    if (field === "name")
      setErrors((prev) => ({ ...prev, providerName: null }));
    if (field === "domain")
      setErrors((prev) => ({ ...prev, providerDomain: null }));
  };

  // Update task field
  const updateTask = (index, field, value) => {
    setTasks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`task_${index}_${field}`]: null }));
  };

  // Toggle task expansion
  const toggleTaskExpanded = (index) => {
    setTasks((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isExpanded: !updated[index].isExpanded,
      };
      return updated;
    });
  };

  // Add new task
  const addTask = () => {
    const newIndex = tasks.length + 1;
    setTasks((prev) => [...prev, createEmptyTask(providerId, newIndex)]);
    setErrors((prev) => ({ ...prev, tasks: null }));
  };

  // Remove task
  const removeTask = (index) => {
    if (tasks.length === 1) {
      showNotification("error", "At least one task is required");
      return;
    }
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate config JSON
  const generateConfig = () => {
    const cleanTasks = tasks.map(
      ({ isExpanded, showAdvanced, platform, ...task }) => {
        // Ensure tags is an array
        if (!task.tags || !Array.isArray(task.tags)) {
          task.tags = [];
        }
        // Convert platform to platforms array
        if (platform === "both") {
          task.platforms = ["ios", "android"];
        } else if (platform === "ios") {
          task.platforms = ["ios"];
        } else if (platform === "android") {
          task.platforms = ["android"];
        } else {
          task.platforms = ["ios", "android"];
        }
        // Add provider_id to each task
        task.provider_id = providerId;
        return task;
      }
    );
    return {
      provider: {
        id: providerId,
        ...provider,
      },
      tasks: cleanTasks,
      updated_at: new Date().toISOString(),
    };
  };

  // Save to Firestore
  const handleSave = async () => {
    if (!validate()) {
      showNotification("error", "Please fix the validation errors");
      return;
    }

    if (!db) {
      showNotification("error", "Database connection not available");
      return;
    }

    setIsSaving(true);
    try {
      const config = generateConfig();
      const docRef = doc(db, "partner_configs_dev", providerId);
      await setDoc(docRef, config);
      showNotification("success", "Configuration saved successfully!");
    } catch (error) {
      console.error("Error saving config:", error);
      showNotification("error", "Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  // Submit for approval
  const handleSubmitForApproval = async () => {
    if (!validate()) {
      showNotification(
        "error",
        "Please fix the validation errors before submitting"
      );
      return;
    }

    if (!db) {
      showNotification("error", "Database connection not available");
      return;
    }

    // Show confirmation if there's already a pending review
    if (approvalStatus && !approvalStatus.approved) {
      setConfirmModal({
        isOpen: true,
        title: "Replace Existing Submission?",
        message:
          "You already have a pending review. Submitting again will replace your current submission.",
        confirmText: "Replace & Submit",
        cancelText: "Cancel",
        variant: "default",
        onConfirm: () => performSubmitForApproval(),
      });
      return;
    }

    performSubmitForApproval();
  };

  // Actual submission logic
  const performSubmitForApproval = async () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    setIsSubmitting(true);
    try {
      const config = generateConfig();

      // Save to approval_waitlist collection
      const approvalDocRef = doc(db, "approval_waitlist", providerId);
      await setDoc(approvalDocRef, {
        ...config,
        approved: false,
        submitted_at: new Date().toISOString(),
        submitted_by: user?.email || "unknown",
      });

      showNotification("success", "Configuration submitted for approval!");
      // Reload approval status
      await loadApprovalStatus();
    } catch (error) {
      console.error("Error submitting for approval:", error);
      showNotification("error", "Failed to submit for approval");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel/withdraw review submission
  const handleCancelReview = async () => {
    if (!db) {
      showNotification("error", "Database connection not available");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Cancel Review Submission?",
      message:
        "Are you sure you want to cancel your review submission? This action cannot be undone.",
      confirmText: "Yes, Cancel Review",
      cancelText: "Keep Review",
      variant: "danger",
      onConfirm: () => performCancelReview(),
    });
  };

  // Actual cancel logic
  const performCancelReview = async () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    setIsCancelling(true);
    try {
      const approvalDocRef = doc(db, "approval_waitlist", providerId);
      await deleteDoc(approvalDocRef);

      setApprovalStatus(null);
      setShowApprovalConfig(false);
      showNotification("success", "Review submission cancelled");
    } catch (error) {
      console.error("Error cancelling review:", error);
      showNotification("error", "Failed to cancel review submission");
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.replace("/partner");
  };

  // Loading state
  if (isLoading || authLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  // Unauthorized state
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6"
          >
            <ShieldX className="w-10 h-10 text-red-500" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Access Denied
          </h1>
          <p className="text-[var(--foreground)] opacity-70 mb-6">
            You don&apos;t have permission to edit the configuration for{" "}
            <span className="font-mono bg-[var(--secondary-background)] px-2 py-1 rounded">
              {providerId}
            </span>
          </p>
          <div className="space-y-3">
            {authProviderId && (
              <button
                onClick={() => router.push(`/partner/${authProviderId}/editor`)}
                className="w-full py-3 px-6 rounded-lg bg-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Go to Your Dashboard
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full py-3 px-6 rounded-lg bg-[var(--secondary-background)] border border-[var(--border-color)] text-[var(--foreground)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--background)] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-[9999] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
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

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-sm text-[var(--foreground)] opacity-60 hover:opacity-100 transition-opacity"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <span className="text-sm text-[var(--foreground)] opacity-60">
              {user?.email}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Partner Config Editor
          </h1>
          <p className="text-[var(--foreground)] opacity-70 mt-2">
            Configure your partner integration settings for TaskGate
          </p>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-sm text-[var(--foreground)] opacity-80">
              <span className="font-semibold">💡 Development Mode:</span> Your
              config is automatically saved and available in the TaskGate dev
              build for testing. Request access to the dev build below, then
              submit for approval when ready for production.
            </p>
            <Link href={`/contact-us?interest=devbuild&provider=${providerId}`}>
              <button className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                <Download className="w-4 h-4" />
                Request TaskGate Dev Build
              </button>
            </Link>
          </div>
        </div>

        {/* Approval Status Section */}
        {approvalStatus && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-6 mb-6 border ${
              approvalStatus.approved
                ? "bg-green-500/10 border-green-500/30"
                : approvalStatus.declined
                ? "bg-red-500/10 border-red-500/30"
                : "bg-yellow-500/10 border-yellow-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {approvalStatus.approved ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : approvalStatus.declined ? (
                  <X className="w-6 h-6 text-red-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {approvalStatus.approved
                      ? "Approved"
                      : approvalStatus.declined
                      ? "Declined"
                      : "Pending Review"}
                  </h3>
                  <p className="text-sm text-[var(--foreground)] opacity-70">
                    {approvalStatus.approved
                      ? "Your config is now available on TaskGate production"
                      : approvalStatus.declined
                      ? `Declined on ${new Date(
                          approvalStatus.declined_at
                        ).toLocaleString()}`
                      : `Submitted on ${new Date(
                          approvalStatus.submitted_at
                        ).toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!approvalStatus.approved && (
                  <button
                    onClick={handleCancelReview}
                    disabled={isCancelling}
                    className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    {isCancelling
                      ? "Cancelling..."
                      : approvalStatus.declined
                      ? "Dismiss"
                      : "Cancel Review"}
                  </button>
                )}
                <button
                  onClick={() => setShowApprovalConfig(!showApprovalConfig)}
                  className="px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] text-sm hover:bg-[var(--secondary-background)] transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showApprovalConfig ? "Hide" : "View"} Submitted Config
                </button>
              </div>
            </div>

            {/* Submitted Config Preview */}
            <AnimatePresence>
              {showApprovalConfig && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="relative">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          JSON.stringify(
                            {
                              provider: approvalStatus.provider,
                              tasks: approvalStatus.tasks,
                              approved: approvalStatus.approved,
                              submitted_at: approvalStatus.submitted_at,
                              submitted_by: approvalStatus.submitted_by,
                            },
                            null,
                            2
                          )
                        );
                        showNotification("success", "JSON copied to clipboard");
                      }}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-[var(--secondary-background)] hover:bg-[var(--background)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100"
                      title="Copy JSON"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-sm text-[var(--foreground)] bg-[var(--background)] p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap break-words border border-[var(--border-color)]">
                      {JSON.stringify(
                        {
                          provider: approvalStatus.provider,
                          tasks: approvalStatus.tasks,
                          approved: approvalStatus.approved,
                          submitted_at: approvalStatus.submitted_at,
                          submitted_by: approvalStatus.submitted_by,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* Provider Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--secondary-background)] rounded-xl p-6 mb-6 border border-[var(--border-color)]"
        >
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">
            Provider Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provider ID (readonly) */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Provider ID
              </label>
              <input
                type="text"
                value={providerId}
                readOnly
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] opacity-60 cursor-not-allowed"
              />
            </div>

            {/* App Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                App Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={provider.name}
                onChange={(e) => updateProvider("name", e.target.value)}
                placeholder="Your App Name"
                className={`w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border ${
                  errors.providerName
                    ? "border-red-500"
                    : "border-[var(--border-color)]"
                } text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
              />
              {errors.providerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.providerName}
                </p>
              )}
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Applink/Universal Link Domain{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={provider.domain}
                onChange={(e) => updateProvider("domain", e.target.value)}
                placeholder="yourapp.com"
                className={`w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border ${
                  errors.providerDomain
                    ? "border-red-500"
                    : "border-[var(--border-color)]"
                } text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
              />
              {errors.providerDomain && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.providerDomain}
                </p>
              )}
            </div>

            {/* Android Package */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Android Package
              </label>
              <input
                type="text"
                value={provider.package_name_android}
                onChange={(e) =>
                  updateProvider("package_name_android", e.target.value)
                }
                placeholder="com.yourapp.android"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            {/* iOS Package */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                iOS Package
              </label>
              <input
                type="text"
                value={provider.package_name_ios}
                onChange={(e) =>
                  updateProvider("package_name_ios", e.target.value)
                }
                placeholder="com.yourapp.ios"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              {errors.packageName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.packageName}
                </p>
              )}
            </div>

            {/* App Store ID */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                App Store ID
              </label>
              <input
                type="text"
                value={provider.app_store_id}
                onChange={(e) => updateProvider("app_store_id", e.target.value)}
                placeholder="123456789"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            {/* URL Scheme */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                URL Scheme
              </label>
              <input
                type="text"
                value={provider.url_scheme}
                onChange={(e) => updateProvider("url_scheme", e.target.value)}
                placeholder="yourapp://"
                className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            {/* Icon Light */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Icon (Light){" "}
                <span className="text-xs opacity-50 font-normal">
                  512×512px
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={provider.icon_path_light}
                  onChange={(e) =>
                    updateProvider("icon_path_light", e.target.value)
                  }
                  placeholder="URL or path to light icon"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <label
                  className={`px-3 py-2.5 rounded-lg bg-[var(--accent)] text-white cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center min-w-[44px] ${
                    isUploading.light ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading.light ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading.light}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0], "icon_path_light");
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Icon Dark */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Icon (Dark){" "}
                <span className="text-xs opacity-50 font-normal">
                  512×512px
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={provider.icon_path_dark}
                  onChange={(e) =>
                    updateProvider("icon_path_dark", e.target.value)
                  }
                  placeholder="URL or path to dark icon"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <label
                  className={`px-3 py-2.5 rounded-lg bg-[var(--accent)] text-white cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center min-w-[44px] ${
                    isUploading.dark ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading.dark ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading.dark}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0], "icon_path_dark");
                      }
                    }}
                  />
                </label>
              </div>
              {errors.icon && (
                <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
              )}
            </div>

            {/* Background Color Light */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Background Color (Light)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={provider.icon_background_color_light}
                  onChange={(e) =>
                    updateProvider(
                      "icon_background_color_light",
                      e.target.value
                    )
                  }
                  className="w-12 h-10 rounded-lg border border-[var(--border-color)] cursor-pointer"
                />
                <input
                  type="text"
                  value={provider.icon_background_color_light}
                  onChange={(e) =>
                    updateProvider(
                      "icon_background_color_light",
                      e.target.value
                    )
                  }
                  placeholder="#FFFFFF"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            {/* Background Color Dark */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Background Color (Dark)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={provider.icon_background_color_dark}
                  onChange={(e) =>
                    updateProvider("icon_background_color_dark", e.target.value)
                  }
                  className="w-12 h-10 rounded-lg border border-[var(--border-color)] cursor-pointer"
                />
                <input
                  type="text"
                  value={provider.icon_background_color_dark}
                  onChange={(e) =>
                    updateProvider("icon_background_color_dark", e.target.value)
                  }
                  placeholder="#000000"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            {/* Icon Background Image Light */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Icon Background Image (Light){" "}
                <span className="text-xs opacity-50 font-normal">
                  512×512px
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={provider.icon_background_img_light}
                  onChange={(e) =>
                    updateProvider("icon_background_img_light", e.target.value)
                  }
                  placeholder="URL or upload image"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                {provider.icon_background_img_light && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage("icon_background_img_light")
                    }
                    className="p-2.5 rounded-lg text-[var(--foreground)] opacity-50 hover:opacity-100 hover:text-red-500 transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <label
                  className={`px-3 py-2.5 rounded-lg bg-[var(--accent)] text-white cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center min-w-[44px] ${
                    isUploading.bgLight ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading.bgLight ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading.bgLight}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(
                          e.target.files[0],
                          "icon_background_img_light"
                        );
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Icon Background Image Dark */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Icon Background Image (Dark){" "}
                <span className="text-xs opacity-50 font-normal">
                  512×512px
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={provider.icon_background_img_dark}
                  onChange={(e) =>
                    updateProvider("icon_background_img_dark", e.target.value)
                  }
                  placeholder="URL or upload image"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                {provider.icon_background_img_dark && (
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage("icon_background_img_dark")
                    }
                    className="p-2.5 rounded-lg text-[var(--foreground)] opacity-50 hover:opacity-100 hover:text-red-500 transition-all"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <label
                  className={`px-3 py-2.5 rounded-lg bg-[var(--accent)] text-white cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center min-w-[44px] ${
                    isUploading.bgDark ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading.bgDark ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading.bgDark}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(
                          e.target.files[0],
                          "icon_background_img_dark"
                        );
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Icon Preview Section */}
            {(provider.icon_path_light || provider.icon_path_dark) && (
              <div className="col-span-2 p-4 bg-[var(--background)] rounded-xl border border-[var(--border-color)]">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                  Icon Preview
                </label>
                <div className="flex gap-8 flex-wrap">
                  {/* Light Mode Preview */}
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--foreground)] opacity-60 text-center">
                      Light Mode
                    </p>
                    <div className="flex gap-4 items-end">
                      {/* Android - Circle */}
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md"
                          style={{
                            backgroundColor: provider.icon_background_img_light
                              ? "transparent"
                              : provider.icon_background_color_light ||
                                "#FFFFFF",
                            backgroundImage: provider.icon_background_img_light
                              ? `url(${provider.icon_background_img_light})`
                              : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {provider.icon_path_light &&
                            provider.icon_path_light.startsWith("http") && (
                              <img
                                src={provider.icon_path_light}
                                alt="Android icon"
                                className="w-10 h-10 object-contain"
                              />
                            )}
                        </div>
                        <p className="text-xs text-[var(--foreground)] opacity-50 mt-1">
                          Android
                        </p>
                      </div>
                      {/* iOS - Rounded Square */}
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-[14px] overflow-hidden flex items-center justify-center shadow-md"
                          style={{
                            backgroundColor: provider.icon_background_img_light
                              ? "transparent"
                              : provider.icon_background_color_light ||
                                "#FFFFFF",
                            backgroundImage: provider.icon_background_img_light
                              ? `url(${provider.icon_background_img_light})`
                              : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {provider.icon_path_light &&
                            provider.icon_path_light.startsWith("http") && (
                              <img
                                src={provider.icon_path_light}
                                alt="iOS icon"
                                className="w-10 h-10 object-contain"
                              />
                            )}
                        </div>
                        <p className="text-xs text-[var(--foreground)] opacity-50 mt-1">
                          iOS
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode Preview */}
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--foreground)] opacity-60 text-center">
                      Dark Mode
                    </p>
                    <div className="flex gap-4 items-end">
                      {/* Android - Circle */}
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md"
                          style={{
                            backgroundColor: provider.icon_background_img_dark
                              ? "transparent"
                              : provider.icon_background_color_dark ||
                                "#000000",
                            backgroundImage: provider.icon_background_img_dark
                              ? `url(${provider.icon_background_img_dark})`
                              : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {(provider.icon_path_dark?.startsWith("http") ||
                            provider.icon_path_light?.startsWith("http")) && (
                            <img
                              src={
                                provider.icon_path_dark?.startsWith("http")
                                  ? provider.icon_path_dark
                                  : provider.icon_path_light
                              }
                              alt="Android icon"
                              className="w-10 h-10 object-contain"
                            />
                          )}
                        </div>
                        <p className="text-xs text-[var(--foreground)] opacity-50 mt-1">
                          Android
                        </p>
                      </div>
                      {/* iOS - Rounded Square */}
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-[14px] overflow-hidden flex items-center justify-center shadow-md"
                          style={{
                            backgroundColor: provider.icon_background_img_dark
                              ? "transparent"
                              : provider.icon_background_color_dark ||
                                "#000000",
                            backgroundImage: provider.icon_background_img_dark
                              ? `url(${provider.icon_background_img_dark})`
                              : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {(provider.icon_path_dark?.startsWith("http") ||
                            provider.icon_path_light?.startsWith("http")) && (
                            <img
                              src={
                                provider.icon_path_dark?.startsWith("http")
                                  ? provider.icon_path_dark
                                  : provider.icon_path_light
                              }
                              alt="iOS icon"
                              className="w-10 h-10 object-contain"
                            />
                          )}
                        </div>
                        <p className="text-xs text-[var(--foreground)] opacity-50 mt-1">
                          iOS
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Tasks Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Tasks
            </h2>
            {errors.tasks && (
              <p className="text-red-500 text-sm">{errors.tasks}</p>
            )}
          </div>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--secondary-background)] rounded-xl border border-[var(--border-color)] overflow-hidden"
              >
                {/* Task Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--background)] transition-colors"
                  onClick={() => toggleTaskExpanded(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono bg-[var(--accent)] text-white px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {task.display_name || "Untitled Task"}
                      </p>
                      <p className="text-sm text-[var(--foreground)] opacity-60">
                        {task.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTask(index);
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {task.isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[var(--foreground)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--foreground)]" />
                    )}
                  </div>
                </div>

                {/* Task Body */}
                <AnimatePresence>
                  {task.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[var(--border-color)]"
                    >
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Task ID (readonly) */}
                          <div>
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                              Task ID
                            </label>
                            <input
                              type="text"
                              value={task.id}
                              readOnly
                              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] opacity-60 cursor-not-allowed text-sm"
                            />
                            {errors[`task_${index}_id`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`task_${index}_id`]}
                              </p>
                            )}
                          </div>

                          {/* Display Name */}
                          <div>
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                              Display Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={task.display_name}
                              onChange={(e) =>
                                updateTask(
                                  index,
                                  "display_name",
                                  e.target.value
                                )
                              }
                              placeholder="Task Display Name"
                              className={`w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border ${
                                errors[`task_${index}_display_name`]
                                  ? "border-red-500"
                                  : "border-[var(--border-color)]"
                              } text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]`}
                            />
                            {errors[`task_${index}_display_name`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`task_${index}_display_name`]}
                              </p>
                            )}
                          </div>

                          {/* Type */}
                          <div>
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                              Type
                            </label>
                            <select
                              value={task.type}
                              onChange={(e) =>
                                updateTask(index, "type", e.target.value)
                              }
                              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            >
                              {TASK_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Difficulty */}
                          <div>
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                              Difficulty
                            </label>
                            <select
                              value={task.difficulty}
                              onChange={(e) =>
                                updateTask(index, "difficulty", e.target.value)
                              }
                              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            >
                              {DIFFICULTY_OPTIONS.map((diff) => (
                                <option key={diff.value} value={diff.value}>
                                  {diff.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={task.description}
                            onChange={(e) =>
                              updateTask(index, "description", e.target.value)
                            }
                            placeholder="Describe what this task does (at least 10 characters)..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                          />
                          {errors[`task_${index}_description`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`task_${index}_description`]}
                            </p>
                          )}
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Tags{" "}
                            <span className="text-xs opacity-50 font-normal">
                              — optional
                            </span>
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {ensureTagsArray(task.tags).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent)] text-white text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTasks((prev) => {
                                      const updated = [...prev];
                                      const currentTags = ensureTagsArray(
                                        updated[index].tags
                                      );
                                      updated[index] = {
                                        ...updated[index],
                                        tags: currentTags.filter(
                                          (_, i) => i !== tagIndex
                                        ),
                                      };
                                      return updated;
                                    });
                                  }}
                                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
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
                                const value = e.target.value.trim();
                                const currentTags = ensureTagsArray(task.tags);
                                if (value && !currentTags.includes(value)) {
                                  setTasks((prev) => {
                                    const updated = [...prev];
                                    const existingTags = ensureTagsArray(
                                      updated[index].tags
                                    );
                                    updated[index] = {
                                      ...updated[index],
                                      tags: [...existingTags, value],
                                    };
                                    return updated;
                                  });
                                  e.target.value = "";
                                }
                              }
                            }}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                          />
                          <p className="mt-1 text-xs text-[var(--foreground)] opacity-50">
                            Press Enter to add a tag
                          </p>
                        </div>

                        {/* Platform */}
                        <div>
                          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            Platform <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-4">
                            {PLATFORM_OPTIONS.map((platform) => (
                              <label
                                key={platform.value}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`platform-${index}`}
                                  checked={task.platform === platform.value}
                                  onChange={() =>
                                    updateTask(
                                      index,
                                      "platform",
                                      platform.value
                                    )
                                  }
                                  className="w-4 h-4 border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
                                />
                                <span className="text-sm text-[var(--foreground)]">
                                  {platform.label}
                                </span>
                              </label>
                            ))}
                          </div>
                          {errors[`task_${index}_platform`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`task_${index}_platform`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Add Task Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addTask}
            className="w-full mt-4 py-3 border-2 border-dashed border-[var(--border-color)] rounded-xl text-[var(--foreground)] flex items-center justify-center gap-2 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </motion.button>
        </motion.section>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] shadow-lg"
        >
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 py-3 px-6 rounded-lg bg-[var(--secondary-background)] border border-[var(--border-color)] text-[var(--foreground)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--background)] transition-colors"
          >
            <Eye className="w-5 h-5" />
            Preview JSON
          </button>
          <button
            onClick={handleSubmitForApproval}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 rounded-lg bg-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Send to Production
              </>
            )}
          </button>
          <div className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[var(--secondary-background)] border border-[var(--border-color)]">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--accent)] border-t-transparent"></div>
                <span className="text-sm text-[var(--foreground)] opacity-70">
                  Saving...
                </span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-[var(--foreground)] opacity-70">
                  Unsaved changes
                </span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-[var(--foreground)] opacity-70">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 opacity-50" />
                <span className="text-sm text-[var(--foreground)] opacity-50">
                  Auto-save enabled
                </span>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Crop Modal - Portal to body */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {cropModal.isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-[var(--secondary-background)] rounded-xl border border-[var(--border-color)] w-full max-w-lg overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Crop Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <Crop className="w-5 h-5 text-[var(--accent)]" />
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        Crop Image
                      </h3>
                    </div>
                    <button
                      onClick={handleCropCancel}
                      className="p-1 rounded-lg hover:bg-[var(--background)] transition-colors"
                    >
                      <X className="w-5 h-5 text-[var(--foreground)]" />
                    </button>
                  </div>

                  {/* Crop Area */}
                  <div className="relative w-full h-80 bg-black overflow-hidden">
                    {cropModal.imageSrc && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={cropModal.imageSrc}
                          alt="Crop preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`,
                            cursor: "move",
                            userSelect: "none",
                          }}
                          draggable={false}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const startX = e.clientX - crop.x;
                            const startY = e.clientY - crop.y;

                            const onMouseMove = (moveEvent) => {
                              setCrop({
                                x: moveEvent.clientX - startX,
                                y: moveEvent.clientY - startY,
                              });
                            };

                            const onMouseUp = () => {
                              document.removeEventListener(
                                "mousemove",
                                onMouseMove
                              );
                              document.removeEventListener(
                                "mouseup",
                                onMouseUp
                              );
                            };

                            document.addEventListener("mousemove", onMouseMove);
                            document.addEventListener("mouseup", onMouseUp);
                          }}
                        />
                        {/* Crop overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg"
                            style={{
                              boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Zoom Controls */}
                  <div className="p-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-4 mb-4">
                      <ZoomOut className="w-4 h-4 text-[var(--foreground)] opacity-50" />
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                      />
                      <ZoomIn className="w-4 h-4 text-[var(--foreground)] opacity-50" />
                      <span className="text-sm text-[var(--foreground)] opacity-70 w-12 text-right">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleCropCancel}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] font-medium hover:bg-[var(--secondary-background)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCropConfirm}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Apply Crop
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Preview Modal - Portal to body */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowPreview(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[var(--background)] rounded-xl border border-[var(--border-color)] w-full max-w-3xl max-h-[80vh] flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      Configuration Preview
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(generateConfig(), null, 2)
                          );
                          showNotification(
                            "success",
                            "JSON copied to clipboard"
                          );
                        }}
                        className="p-2 hover:bg-[var(--secondary-background)] rounded-lg transition-colors flex items-center gap-2 text-[var(--foreground)] opacity-70 hover:opacity-100"
                        title="Copy JSON"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="p-2 hover:bg-[var(--secondary-background)] rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-[var(--foreground)]" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1">
                    <pre className="text-sm text-[var(--foreground)] bg-[var(--secondary-background)] p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words">
                      {JSON.stringify(generateConfig(), null, 2)}
                    </pre>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Confirmation Modal */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {confirmModal.isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() =>
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-[var(--secondary-background)] rounded-xl border border-[var(--border-color)] w-full max-w-md overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div
                      className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                        confirmModal.variant === "danger"
                          ? "bg-red-500/10"
                          : "bg-[var(--accent)]/10"
                      }`}
                    >
                      {confirmModal.variant === "danger" ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-[var(--accent)]" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] text-center mb-2">
                      {confirmModal.title}
                    </h3>
                    <p className="text-sm text-[var(--foreground)] opacity-70 text-center">
                      {confirmModal.message}
                    </p>
                  </div>
                  <div className="flex gap-3 p-4 pt-0">
                    <button
                      onClick={() =>
                        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                      }
                      className="flex-1 py-2.5 px-4 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] font-medium hover:bg-[var(--secondary-background)] transition-colors"
                    >
                      {confirmModal.cancelText}
                    </button>
                    <button
                      onClick={() => confirmModal.onConfirm?.()}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-opacity hover:opacity-90 ${
                        confirmModal.variant === "danger"
                          ? "bg-red-500 text-white"
                          : "bg-[var(--accent)] text-white"
                      }`}
                    >
                      {confirmModal.confirmText}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
