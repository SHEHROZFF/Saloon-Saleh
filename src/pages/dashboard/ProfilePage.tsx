import { useAppSelector } from '@store/hooks';
import Card from '@components/ui/Card';

const ProfilePage = () => {
    const user = useAppSelector(state => state.auth.user);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="mt-2 text-gray-600">Manage your account settings</p>
            </div>

            <Card title="User Information">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="mt-1 text-gray-900">{user?.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">User Type</label>
                        <p className="mt-1 capitalize text-gray-900">{user?.userType}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;
