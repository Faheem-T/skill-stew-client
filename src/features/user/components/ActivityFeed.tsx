interface ActivityItem {
  id: string;
  person: string;
  action: string;
  time: string;
  colorClass: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div
            className={`w-2 h-2 ${activity.colorClass} rounded-full mt-2`}
          ></div>
          <div>
            <p className="text-sm text-text">
              <span className="font-medium">{activity.person}</span>{" "}
              {activity.action}
            </p>
            <p className="text-xs text-text/60">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
