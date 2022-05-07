import React, { useRef, useState } from "react";
import { ChatTeardropDots } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";

import { styles } from "./styles";
import { Options } from "../Options";
import { Form } from "../Form";
import { Success } from "../Success";

import { feedbackTypes } from "../../utils/feedbackTypes";

export type FeedbackType = keyof typeof feedbackTypes;

export function Widget() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpen = () => {
    bottomSheetRef.current?.expand();
  };

  const handleFeedbackRestart = () => {
    setFeedbackType(null);
    setFeedbackSent(false);
  };

  const handleFeedbackSent = () => {
    setFeedbackSent(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableOpacity style={styles.button} onPress={handleOpen}>
        <ChatTeardropDots
          weight="bold"
          size={24}
          color={theme.colors.text_on_brand_color}
        />
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[1, 280]}
        backgroundStyle={styles.modal}
        handleIndicatorStyle={styles.indicator}
      >
        {feedbackSent ? (
          <Success onSendAnotherFeedback={handleFeedbackRestart} />
        ) : (
          <>
            {feedbackType ? (
              <Form
                feedbackType={feedbackType}
                onFeedbackCanceled={handleFeedbackRestart}
                onFeedbackSent={handleFeedbackSent}
              />
            ) : (
              <Options onFeedbackTypeChanged={setFeedbackType} />
            )}
          </>
        )}
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
