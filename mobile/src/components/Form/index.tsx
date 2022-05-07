import React, { useState } from "react";
import { View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import { FeedbackType } from "../Widget";

import { styles } from "./styles";
import { theme } from "../../theme";
import { feedbackTypes } from "../../utils/feedbackTypes";
import { ScreenshotButton } from "../ScreenshotButton";
import { Button } from "../Button";
import { api } from "../../libs/api";

interface FormProps {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent,
}: FormProps) {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const feedbackTypeInfo = feedbackTypes[feedbackType];

  const handleScreenshot = async () => {
    try {
      const uri = await captureScreen({
        format: "png",
        quality: 0.8,
      });

      setScreenshot(uri);
    } catch (err) {
      console.log(err);
    }
  };

  const handleScreenshotRemove = () => {
    setScreenshot(null);
  };

  const handleSendFeedback = async () => {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);
    const screenshotBase64 =
      screenshot &&
      (await FileSystem.readAsStringAsync(screenshot, { encoding: "base64" }));

    try {
      await api.post("/feedbacks", {
        type: feedbackType,
        screenshot: `data:image/png;base64,${screenshotBase64}`,
        comment,
      });

      onFeedbackSent();
    } catch (err) {
      console.log(err);
      setIsSendingFeedback(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />

          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        onChangeText={setComment}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
      />

      <View style={styles.footer}>
        <ScreenshotButton
          screenshot={screenshot}
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
        />

        <Button onPress={handleSendFeedback} isLoading={isSendingFeedback} />
      </View>
    </View>
  );
}
