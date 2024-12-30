import React from "react";
import { PoseViewer } from "react-pose-viewer";

export const Viewer: React.FC = () => {
  // @ts-ignore magic
  const docuemntSrc = documentUri;

  return (
    <PoseViewer src={docuemntSrc} autoplay loop height={512} width={512} />
  );
};
