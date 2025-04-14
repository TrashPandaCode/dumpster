import { Route, Routes } from "react-router";

import Home from "./pages/Home.tsx";

export const AppRoutes = () => (
	<Routes>
		<Route
			path="/"
			element={<Home />}
		/>
	</Routes>
);
