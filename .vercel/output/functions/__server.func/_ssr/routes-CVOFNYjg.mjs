import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1 } from "./router-BygGcKsi.mjs";
import { t as MenuApp } from "./MenuApp-CzgxdW9x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CVOFNYjg.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { mesa } = Route$1.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuApp, { hash: mesa });
}
//#endregion
export { Home as component };
