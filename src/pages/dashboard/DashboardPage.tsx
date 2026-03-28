import { useAppSelector } from '@store/hooks';
import Card from '@components/ui/Card';

const DashboardPage = () => {
    const user = useAppSelector(state => state.auth.user);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                <p className="mt-2 text-gray-600">Needy Assistance Platform Dashboard</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Quick Stats">
                    <p className="text-gray-600">Your dashboard content goes here</p>
                </Card>

                <Card title="Recent Activity">
                    <p className="text-gray-600">Activity feed will appear here</p>
                </Card>

                <Card title="Notifications">
                    <p className="text-gray-600">You have no new notifications</p>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
