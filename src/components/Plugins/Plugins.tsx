// import React from "react";
// import styles from "./Plugins.module.css";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useDisclosure } from "@nextui-org/modal";
// import { ScrollShadow } from "@nextui-org/scroll-shadow";
// import { useSelector } from "react-redux";
// import { selectAuthState } from "../../store/authSlice";
// import { PLUGINS } from "@/utils/data";

// import PluginInactive from "../../../public/svgs/sidebar/Plugin_Inactive.svg";

// interface Plugin {
//   tag: string;
//   name: string;
//   comingSoon: boolean;
//   url: string;
//   icon?: React.ReactNode;
//   description: string;
// }

// const groupByTag = (plugins: Plugin[]) => {
//   return plugins.reduce((acc, plugin) => {
//     if (!acc[plugin.tag]) {
//       acc[plugin.tag] = [];
//     }
//     acc[plugin.tag].push(plugin);
//     return acc;
//   }, {} as Record<string, Plugin[]>);
// };

// const Plugins = () => {
//   const router = useRouter();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const isAuthenticated = useSelector(selectAuthState);
//   const handleAuth = () => {
//     onOpen();
//   };

//   const groupedPlugins = groupByTag(PLUGINS);

//   return (
//     <div className={styles.list}>
//       <div className={styles.titleContainer}>
//         <div className={styles.title}>Plugins</div>
//       </div>
//       <ScrollShadow hideScrollBar className="h-[calc(100vh_-_50px)] w-full">
//         <div className={styles.listContainer}>
//           {Object.keys(groupedPlugins).map((tag) => (
//             <React.Fragment key={tag}>
//               <div key={`header-${tag}`} className={styles.listHeader}>
//                 {tag}
//               </div>
//               {groupedPlugins[tag].map((item, index) => (
//                 <div
//                   key={index}
//                   className={styles.listItem}
//                   style={{ opacity: item.comingSoon ? 0.75 : 1 }}
//                   onClick={() => router.push(item.url)}
//                 >
//                   <div className={styles.listIconContainer}>
//                     {/* <Image
//                       src={PluginInactive}
//                       alt="Plugin Icon"
//                       className={styles.listIcon}
//                     /> */}
//                     <Image
//                       src={item.icon ?? PluginInactive}
//                       alt="Plugin Icon"
//                       className={styles.listIcon}
//                     />
//                   </div>
//                   <div className={styles.listItemText}>
//                     <div className={styles.name}>{item.name}</div>
//                     <div className={styles.description}>{item.description}</div>
//                   </div>
//                 </div>
//               ))}
//             </React.Fragment>
//           ))}
//           {/* <div className={styles.emptyState}>
//             <Image
//               src={PluginInactive}
//               alt="Plugin Empty"
//               className={styles.emptyStateIcon}
//             />
//             <p className={styles.emptyStateText}>
//               Build your own plugin. Coming Soon!
//             </p>
//           </div> */}
//         </div>
//       </ScrollShadow>
//       {/* {!isAuthenticated && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.button} onClick={handleAuth}>
//             Sign In
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default Plugins;






"use client";

import React from "react";
import styles from "./Plugins.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/authSlice";
import { PLUGINS } from "@/utils/data";
import PluginInactive from "../../../public/svgs/sidebar/Plugin_Inactive.svg";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface Plugin {
  tag: string;
  name: string;
  comingSoon: boolean;
  url: string;
  icon?: React.ReactNode;
  description: string;
}

const groupByTag = (plugins: Plugin[]) => {
  return plugins.reduce((acc, plugin) => {
    if (!acc[plugin.tag]) {
      acc[plugin.tag] = [];
    }
    acc[plugin.tag].push(plugin);
    return acc;
  }, {} as Record<string, Plugin[]>);
};

const Plugins = () => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectAuthState);
  const [loading, setLoading] = useState(false);

  const groupedPlugins = groupByTag(PLUGINS);

  const handleCheckout = async () => {
    console.log("Attempting to access Checkout with Stripe settings");
    if (!stripePromise) {
      alert("Stripe is not configured. Please check your environment variables.");
      console.log("Stripe not configured");
      return;
    }
    setLoading(true);
    try {
      console.log("Fetching Stripe checkout session");
      const response = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (stripe) {
        console.log("Redirecting to Stripe checkout");
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Stripe Checkout error:", error.message);
          alert("Error redirecting to checkout: " + error.message);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      console.log("Checkout process completed");
    }
  };

  return (
    <div className={styles.list}>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Plugins</div>
      </div>
      <ScrollShadow hideScrollBar className="h-[calc(100vh_-_50px)] w-full">
        <div className={styles.listContainer}>
          {Object.keys(groupedPlugins).map((tag) => (
            <React.Fragment key={tag}>
              <div key={`header-${tag}`} className={styles.listHeader}>
                {tag}
              </div>
              {groupedPlugins[tag].map((item, index) => (
                <div
                  key={index}
                  className={styles.listItem}
                  style={{ opacity: item.comingSoon ? 0.75 : 1 }}
                  onClick={() => {
                    console.log(`Attempting to navigate to ${item.url}`);
                    if (router) {
                      router.push(item.url);
                      console.log(`Navigated to ${item.url}`);
                    } else {
                      console.log("Router is not available");
                    }
                  }}
                >
                  <div className={styles.listIconContainer}>
                    <Image
                      src={item.icon ?? PluginInactive}
                      alt="Plugin Icon"
                      className={styles.listIcon}
                    />
                  </div>
                  <div className={styles.listItemText}>
                    <div className={styles.name}>{item.name}</div>
                    <div className={styles.description}>{item.description}</div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          {/* <div className={styles.emptyState}>
            <Image
              src={PluginInactive}
              alt="Plugin Empty"
              className={styles.emptyStateIcon}
            />
            <p className={styles.emptyStateText}>
              Build your own plugin. Coming Soon!
            </p>
          </div> */}
        </div>
      </ScrollShadow>
      <div className={styles.modalOverlay}>
        <div
          className={styles.button}
          onClick={handleCheckout}
          style={{ opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Loading..." : "Checkout with Stripe"}
        </div>
      </div>
    </div>
  );
};

export default Plugins;