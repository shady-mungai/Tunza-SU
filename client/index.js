import { registerRootComponent } from "expo";

import App from "./app";
import {
  initializeObservability,
  withObservability,
} from "./src/observability";

initializeObservability();
registerRootComponent(withObservability(App));
