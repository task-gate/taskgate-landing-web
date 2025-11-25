import React from "react";
import Image from "next/image"; // If using Next.js

const GooglePlayDownloadButton = () => {
  const androidUrl =
    "https://play.google.com/store/apps/details?id=com.tkg.taskgate.prod";
  const iosAppId = "6740745547";
  const androidPackageName = "com.ever.journal";

  const handleClick = () => {
    if (typeof window !== "undefined") {
      import("react-facebook-pixel").then((module) => {
        const ReactPixel = module.default;
        ReactPixel.init(process.env.NEXT_PUBLIC_META_PIXEL_ID);
        ReactPixel.trackCustom("GOOGLE_PLAY_Click", {
          button_name: "Google Play",
        });
        console.log("Google Play button clicked");
      });
    }

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      // Open Google Play Store in a new tab
      window.open(
        `https://play.google.com/store/apps/details?id=${androidPackageName}`,
        "_blank"
      );
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // Open Apple App Store in a new tab
      window.open(`https://apps.apple.com/app/id${iosAppId}`, "_blank");
    } else {
      // Fallback to a landing page or website
      window.open(androidUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{ border: "none", background: "none", padding: 0 }}
    >
      <Image
        src="/buttons/google-play-badge.png"
        alt="Get it on Google Play"
        className="w-[150px] h-[45px]"
        width={150} // Adjust width as needed
        height={50} // Adjust height as needed
      />
    </button>
  );
};

export default GooglePlayDownloadButton;
