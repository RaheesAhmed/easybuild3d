import ViewportContainer from "./components/viewport/ViewportContainer";
import { Suspense } from "react";

function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100">
      <div className="w-full h-full">
        <Suspense fallback={<div>Loading...</div>}>
          <ViewportContainer />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
