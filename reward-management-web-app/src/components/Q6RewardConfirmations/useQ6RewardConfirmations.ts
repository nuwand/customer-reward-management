/**********************************************************************
 *
 *   Component hook generated by Quest
 *
 *   Code Logic for the component goes in this hook
 *   To setup bindings that use the data here or call the functions here, use the Quest editor
 *   Do not change the name of the hook
 *
 *   For help and further details refer to: https://www.quest.ai/docs
 *
 *
 **********************************************************************/

 import React, { useEffect } from "react";
 import useQ6RewardConfirmationsResponsiveSize from "./useQ6RewardConfirmationsResponsiveSize";
 import { useAuthContext } from "@asgardeo/auth-react";
 import { useParams, useNavigate } from "react-router-dom";
 import { Reward, RewardConfirmation } from "src/api/types";
 import { getQRCode, getRewardDetails, getRewardConfirmations } from "src/api/api";
 
 /* These are the possible values for the current variant. Use this to change the currentVariant dynamically.
 Please don't modify */
 const variantOptions = {
   ScreenDesktop: "ScreenDesktop",
   ScreenMobile: "ScreenMobile",
 };
 
 const useQ6RewardConfirmations = () => {
   const [currentVariant, setCurrentVariant] = React.useState<string>(
     variantOptions["ScreenDesktop"]
   );
   const navigate = useNavigate();
   const { rewardId } = useParams();
   const [qrCode, setQrCode] = React.useState<any>();
   const [isRewardLoading, setIsRewardLoading] = React.useState(false);
   const [isQRLoading, setIsQRLoading] = React.useState(true);
   const [reward, setReward] = React.useState<Reward | null>(null);
   const [isRewardConfirmationsLoading, setIsRewardConfirmationsLoading] = React.useState(true);
   const [rewardConfirmations, setRewardConfirmations] = React.useState<RewardConfirmation[] | null>([]);
   const { state } = useAuthContext();
 
   const getRewardImage = (rewardName: string) => {
     switch (rewardName) {
       case "Target":
         return "/images/target.png";
       case "Starbucks Coffee":
         return "/images/starbucks.png";
       case "Jumba Juice":
         return "/images/jamba.png";
       case "Grubhub":
         return "/images/grubhub.png";
       default:
         return "";
     }
   };
 
   async function getRewardInfo() {
     if (rewardId) {
       setIsRewardLoading(true);
       getRewardDetails(rewardId)
         .then((res) => {
           const logoUrl = getRewardImage(res.data.name);
           setReward({ ...res.data, logoUrl });
         })
         .catch((e) => {
           console.log(e);
         })
         .finally(() => {
           setIsRewardLoading(false);
         });
     }
   }
 
   async function getGeneratedQRCode(
     userId: string,
     rewardId: string
   ) {
     setIsQRLoading(true);
     getRewardConfirmations(userId).then((res) => {
       console.log('reward confirmations');
       console.log(res);
       const rewardConfirmations: RewardConfirmation[] = res.data;
       rewardConfirmations.forEach((rewardConfirmation) => {
         console.log(rewardConfirmation);
         const base64Image = `data:image/png;base64,${rewardConfirmation.qrCode}`; // Replace with your base64-encoded image data
         // Create an image element to display the base64-encoded image
         const img = document.createElement('img');
         img.src = base64Image;
         img.alt = `Image from ${rewardConfirmation.rewardId}`;
         document.body.appendChild(img);
       });
     })
     getQRCode(userId, rewardId)
       .then((res) => {
         const imageObjectURL = URL.createObjectURL(res.data);
         setQrCode(imageObjectURL);
         setIsQRLoading(false);
       })
       .catch((e) => {
         console.log(e);
       })
       .finally(() => {
         setIsRewardLoading(false);
       });
   }

    async function getConfirmedRewards(userId) {
        setIsRewardConfirmationsLoading(true);
        getRewardConfirmations(userId)
            .then((res) => {
                console.log('reward confirmations');
                console.log(res);
                const rewardConfirmations: RewardConfirmation[] = res.data;
                setRewardConfirmations(rewardConfirmations);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setIsRewardLoading(false);
            });
   }
 
   useEffect(() => {
     if (state.isAuthenticated && state.sub) {
    // TODO: Replace with below logic   
    //    getConfirmedRewards(state.sub);
       getConfirmedRewards("U451298");
       getRewardInfo();
     }
   }, [state.isAuthenticated, state.sub]);
 
   useEffect(() => {
     if (state.sub && reward) {
       getGeneratedQRCode("U451298", reward.id);
     }
   }, [state.sub, reward]);
 
   const breakpointsVariant = useQ6RewardConfirmationsResponsiveSize();
 
   React.useEffect(() => {
     if (breakpointsVariant !== currentVariant) {
       setCurrentVariant(breakpointsVariant);
     }
   }, [breakpointsVariant]);
 
   const data: any = {
     currentVariant,
     reward,
     isRewardLoading,
     isQRLoading,
     isRewardConfirmationsLoading,
     qrCode,
     rewardConfirmations,
   };
   const backToRewards = (): any => {
     navigate("/rewards");
   };
 
   const fns: any = { backToRewards, setCurrentVariant };
 
   return { data, fns };
 };
 
 export default useQ6RewardConfirmations;
 