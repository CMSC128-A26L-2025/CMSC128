import React, { useState, useEffect, useCallback,useRef } from "react";
import Notification_View from "./notification_view";
import { useAuth } from "../auth/AuthContext";

export default function Notification({ setVisible }) {
  const { authAxios, user } = useAuth();
  const [ notifications, setNotifications ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  
  const [isNotificationViewVisible, setIsNotificationViewVisible] = useState(false); // For modal visibility
  const [currentNotificationForView, setCurrentNotificationForView] = useState(null); // Data for Notification_View

  const fetchUnreadNotifications = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
          const response = await authAxios.get('/notifications/unread');
          setNotifications(response.data || []);
      } catch (err) {
          console.error("Failed to fetch notifications:", err);
          setError(err.response?.data?.message || "Failed to load notifications.");
          setNotifications([]);
      } finally {
          setIsLoading(false);
      }
  }, [authAxios, user]);

  useEffect(() => {
    fetchUnreadNotifications();
  }, [fetchUnreadNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
        const response = await authAxios.patch(`/notifications/${notificationId}/read`);

        setNotifications(prevNotifications =>
            prevNotifications.map(notif => {
                if (notif._id === notificationId) {
                    const updatedNotifData = {
                        ...notif,
                        status: 'read',
                        isRead: true, 
                        ...response.data, 
                        announcement: notif.announcement
                    };
                    return updatedNotifData;
                }
                return notif;
            })
        );

        if (selectedNotificationInfo && selectedNotificationInfo._id === notificationId) {
            setSelectedNotificationInfo(prevInfo => ({
                ...prevInfo,
                status: 'read',
                isRead: true,
                announcement: prevInfo.announcement
            }));
        }
      } catch (err) {
          console.error("Failed to mark notification as read:", err);
      }
  };

  const handleDeleteNotification = async (notificationId, e) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this notification?")) {
          try {
              await authAxios.delete(`/notifications/${notificationId}`);
              setNotifications(prevNotifications =>
                  prevNotifications.filter(notif => notif._id !== notificationId)
              );
              if (currentNotificationForView && currentNotificationForView._id === notificationId) {
                  setIsNotificationViewVisible(false);
                  setCurrentNotificationForView(null);
              }
          } catch (err) {
              console.error("Failed to delete notification:", err);
              alert(err.response?.data?.message || "Could not delete notification.");
          }
      }
  };

  const handleNotificationItemClick = (notificationItem) => {
      setCurrentNotificationForView(notificationItem);
      setIsNotificationViewVisible(true);
      if (notificationItem.status === 'unread') {
          handleMarkAsRead(notificationItem._id);
      }
  };

  const refetchNotifications = () => {
      fetchUnreadNotifications();
  };
  const modalRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setVisible]);

  return (
    <div className="fixed inset-0 flex justify-end items-start z-70 p-8 bg-black/50">
      {isNotificationViewVisible && currentNotificationForView && (
          <Notification_View
              notification_info={currentNotificationForView}
              setNotification_view={setIsNotificationViewVisible}
          />

      )}

      {/* Modal content */}
      <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg w-[30vw]">
        {/* Modal header */}
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t">
          <h2 className="text-emerald-800 text-4xl font-extrabold">Notifications</h2>
          <button
            onClick={() => setVisible(false)}
            type="button"
            className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal body */}
          <div className="h-[72vh] w-auto overflow-y-auto space-y-1  py-1 bg-white rounded-lg shadow-inner 
                                    [&::-webkit-scrollbar]:w-2
                                    [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 px-1">
            {!isLoading && error && (
                <div className="p-4 text-center text-red-600">
                    <p>{error}</p>
                    <button onClick={refetchNotifications} className="mt-2 text-sm text-blue-500 hover:underline">Try again</button>
                </div>
            )}
            {!isLoading && !error && notifications.length === 0 && (
                <p className="text-gray-500 text-center py-10">You have no unread notifications.</p>
            )}
            {!isLoading && !error && notifications.length > 0 && (
                <ul className="space-y-1">
                    {notifications.map((notificationItem) => (
                        <li
                            key={notificationItem._id}
                            onClick={() => handleNotificationItemClick(notificationItem)}
                            className={`group p-3 sm:p-4 rounded-lg transition-all duration-150 cursor-pointer flex justify-between items-center
                                        ${notificationItem.status === 'read' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-emerald-50 shadow-sm'}`}
                        >
                            <div className="flex-grow">
                                <div className="flex items-center">
                                    {notificationItem.status === 'unread' && (
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5 flex-shrink-0" title="Unread"></span>
                                    )}
                                    <span className={`font-semibold text-sm sm:text-base ${notificationItem.status === 'read' ? 'text-gray-600' : 'text-emerald-800'}`}>
                                        {notificationItem.announcement?.title || "Notification"}
                                    </span>
                                </div>
                                <p className={`text-xs sm:text-sm mt-1 line-clamp-2 ${notificationItem.status === 'read' ? 'text-gray-500' : 'text-gray-600'}`}>
                                    {notificationItem.announcement?.content || "No content available."}
                                </p>
                                <span className="text-gray-400 text-xs group-hover:text-gray-500 mt-1.5 block">
                                    {new Date(notificationItem.createdAt).toLocaleString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit', hour12: true
                                    })}
                                </span>
                            </div>
                            <button
                                onClick={(e) => handleDeleteNotification(notificationItem._id, e)}
                                title="Delete Notification"
                                className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 flex-shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75H4.5a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5H14A2.75 2.75 0 0 0 11.25 1H8.75ZM10 4.5a.75.75 0 0 0-1.5 0v9.546l-.401-.401a.75.75 0 1 0-1.06 1.061l1.5 1.5a.75.75 0 0 0 1.06 0l1.5-1.5a.75.75 0 1 0-1.06-1.06l-.401.401V4.5Z" clipRule="evenodd" />
                                    <path d="M5.582 8.052a.75.75 0 0 1 .53-.22h7.776a.75.75 0 0 1 .53.22l.759.759A3.25 3.25 0 0 1 16 11.75v.5a2.75 2.75 0 0 1-2.75 2.75H6.75A2.75 2.75 0 0 1 4 12.25v-.5a3.25 3.25 0 0 1 .832-2.94l.75-.758Z" />
                                </svg>
                                <span className="sr-only">Delete</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
          </div>
      </div>
    </div>
  );
}
