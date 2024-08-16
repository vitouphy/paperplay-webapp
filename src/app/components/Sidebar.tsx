export const SideBar = () => (
  <div className="bg-gray-800 text-white w-64 hidden lg:block">
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your App</h2>
    </div>
    <ul className="space-y-2">
      <li>
        <a href="#" className="block pl-6 py-2 hover:bg-gray-700">
          Dashboard
        </a>
      </li>
    </ul>
  </div>
);
