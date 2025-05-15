
import { useState } from "react";

export default function Notification_View({notification_info, setNotification_view}){
    if (!notification_info) {
        return null;
    }

    const title = notification_info.announcement?.title || "Notification Details";
    const content = notification_info.announcement?.content || "No content available for this notification.";
    const receivedDate = notification_info.createdAt
      ? new Date(notification_info.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
      })
      : "Date not available";

    return (
    <div>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-60 p-4" role="dialog" aria-modal="true" aria-labelledby="notification-view-title">
            <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] shadow-xl flex flex-col animate-fadeIn">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 id="notification-view-title" className="text-2xl md:text-3xl font-bold text-emerald-800 break-words">
                        {title}
                    </h2>
                    <button
                        onClick={() => setNotification_view(false)}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>

                {/* Notification Metadata */}
                <p className="text-gray-500 text-sm mb-4">
                    Received: {receivedDate}
                </p>

                {/* Notification Content */}
                <div className="flex-grow overflow-y-auto whitespace-pre-line bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-left p-4 
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-gray-100
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-400
                                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-3">
                    {content}
                </div>

                {/* Modal Footer/Actions */}
                <div className="flex justify-end pt-4 mt-auto border-t">
                    <button
                        onClick={() => setNotification_view(false)}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
   );
}