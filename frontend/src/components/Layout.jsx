// import { LogOut } from "lucide-react";
// import { useAuth } from "../context/AuthContext.jsx";

// export default function Layout({ children }) {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-slate-100">
//       <header className="border-b border-indigo-200 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
// <div>
//   <h1 className="text-2xl font-bold text-slate-900">
//     Food Delivery Management
//   </h1>

//   <p className="mt-1 text-lg font-medium text-indigo-600">
//     Hi, {user.name} 👋
//   </p>

//   <p className="text-sm text-slate-500">
//     {user.role.replaceAll("_", " ")}
//   </p>
// </div>
//           <button
//             className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
//             onClick={logout}
//             type="button"
//           >
//             <LogOut size={16} />
//             Logout
//           </button>
//         </div>
//       </header>
//       <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
//     </div>
//   );
// }
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="border-b border-orange-300 bg-gradient-to-r from-orange-200 to-orange-400 text-orange-700 shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-3xl font-bold">
              Food Delivery Management
            </h1>

            <p className="mt-1 text-lg font-medium text-orange-600">
              Hi, {user?.name} 👋
            </p>

            <p className="text-sm text-orange-600">
              {user?.role?.replaceAll("_", " ")}
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-orange-600 shadow-sm transition hover:bg-orange-50"
            onClick={logout}
            type="button"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}