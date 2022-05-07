import { CloseButton } from "../CloseButton";

import bugImage from "../../assets/bug.svg";
import ideaImage from "../../assets/idea.svg";
import otherImage from "../../assets/thought.svg";
import { useState } from "react";
import { FeedbackTypeStep } from "./Steps/FeedbackTypeStep";
import { FeedbackContentStep } from "./Steps/FeedbackContentStep";
import { FeedbackSuccessStep } from "./Steps/FeedbackSuccessStep";

export const feedbackTypes = {
  BUG: {
    title: "Problema",
    image: {
      source: bugImage,
      alt: "Imagem de um inseto",
    },
  },
  IDEA: {
    title: "Ideia",
    image: {
      source: ideaImage,
      alt: "Imagem de uma lâmpada",
    },
  },
  OTHER: {
    title: "Outro",
    image: {
      source: otherImage,
      alt: "Imagem de um balão de pensamento",
    },
  },
};

export type FeedbackType = keyof typeof feedbackTypes;

export function WidgetForm() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleRestartFeedback = () => {
    setFeedbackSent(false);
    setFeedbackType(null);
  };

  return (
    <>
      <div className="bg-zinc-900 p-4 relative rounded-2xl mb-4 flex flex-col items-center shadow-lg w-[calc(100vw-2rem)] md:w-auto">
        {feedbackSent ? (
          <FeedbackSuccessStep
            onFeedbackRestartRequested={handleRestartFeedback}
          />
        ) : (
          <>
            {!feedbackType ? (
              <FeedbackTypeStep onFeedbackTypeChanged={setFeedbackType} />
            ) : (
              <FeedbackContentStep
                onFeedbackSent={() => setFeedbackSent(true)}
                onFeedbackRestartRequested={handleRestartFeedback}
                feedbackType={feedbackType}
              />
            )}
          </>
        )}

        <footer className="text-xs text-neutral-400">
          Feito com ♥ por{" "}
          <a
            href="https://www.linkedin.com/in/debora-zandonai-4ab092195/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Debora Zandonai
          </a>
        </footer>
      </div>
    </>
  );
}
