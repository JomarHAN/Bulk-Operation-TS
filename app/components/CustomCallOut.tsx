import { CalloutCard } from "@shopify/polaris";
import React from "react";

interface CustomCallOutCardProps {
  title: string;
  illustration: string;
  primaryActionContent: string;
  primaryActionUrl: string;
  children: React.ReactNode;
}

export function CustomCallOut(props: CustomCallOutCardProps) {
  const {
    title,
    illustration,
    primaryActionContent,
    primaryActionUrl,
    children,
  } = props;
  return (
    <CalloutCard
      title={title}
      illustration={illustration}
      primaryAction={{
        content: primaryActionContent,
        url: primaryActionUrl,
      }}
    >
      <br />
      {children}
    </CalloutCard>
  );
}
