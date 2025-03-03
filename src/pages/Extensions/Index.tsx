import type React from "react";

import { DocumentIcon, GanttChartIcon, RainIcon } from "evergreen-ui";

import { useDevice } from "@app/core/stores/deviceStore.js";
import { TabbedContent, TabType } from "@components/layout/page/TabbedContent";
import { FileBrowser } from "@pages/Extensions/FileBrowser";

import { Environment } from "./Environment.js";

export const ExtensionsPage = (): JSX.Element => {
  const { hardware } = useDevice();

  const tabs: TabType[] = [
    {
      name: "File Browser",
      icon: DocumentIcon,
      element: FileBrowser,
      disabled: !hardware.hasWifi,
    },
    {
      name: "Range Test",
      icon: GanttChartIcon,
      element: FileBrowser,
      disabled: !hardware.hasWifi,
    },
    {
      name: "Environment",
      icon: RainIcon,
      element: Environment,
    },
  ];

  return <TabbedContent tabs={tabs} />;
};
