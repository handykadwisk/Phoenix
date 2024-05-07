import { useState, PropsWithChildren } from 'react';
import { User } from '@/types';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User, header: string }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarDesktopOpen, setSidebarDesktopOpen] = useState(true);

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} sidebarDesktopOpen={sidebarDesktopOpen} setSidebarDesktopOpen={setSidebarDesktopOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} sidebarDesktopOpen={sidebarDesktopOpen} setSidebarDesktopOpen={setSidebarDesktopOpen} user={user} header={header} children={children} />
          {/* <!-- ===== Header End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
    );
}
