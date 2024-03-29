import { Routes as ReactRouterRoutes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../../components/layouts/AppLayout';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { ApplicantModule } from '../../modules/app/applicant/ApplicantModule';
import { CreateApplicantForm } from '../../modules/app/applicant/forms/create-applicant/CreateApplicantForm';
import { EmployApplicantForm } from '../../modules/app/applicant/forms/employ-applicant/EmployApplicantForm';
import { UpdateApplicantForm } from '../../modules/app/applicant/forms/update-applicant/UpdateApplicantForm';
import { useAuthStore } from '../../modules/auth/Auth.store';
import { Login } from '../../modules/auth/Login/Login';
import { Dashboard } from '../../modules/app/dashboard/Dashboard';
import { EmployeeModule } from '../../modules/app/employee/EmployeeModule';
import { CreateEmployeeForm } from '../../modules/app/employee/forms/create-employee/CreateEmployeeForm';
import { UpdateEmployeeForm } from '../../modules/app/employee/forms/update-employee/UpdateEmployeeForm';
import { Example } from '../../modules/example/Example';
import { ExampleForm } from '../../modules/example/ExampleForm';
import { ExampleTable } from '../../modules/example/ExampleTable';
import { CreatePositionForm } from '../../modules/app/position/forms/create-position/CreatePositionForm';
import { UpdatePositionForm } from '../../modules/app/position/forms/update-position/UpdatePositionForm';
import { PositionModule } from '../../modules/app/position/PositionModule';
import { ProtectedRoute } from './ProtectedRoute';
import { RegisterEmployee } from '../../modules/auth/RegisterEmployee/RegisterEmployee';
import { QrDisplay } from '../../modules/app/qr-display/QrDisplay';
import jwtDecode from 'jwt-decode';
import { JWT_Claims } from '../../modules/auth/Auth.interface';
import dayjs from 'dayjs';
import { AttendanceModule } from '../../modules/app/attendance/AttendanceModule';
import { DailyEmployeesNotOnLeaveList } from '../../modules/app/attendance/daily-employees-not-on-leave-list/DailyEmployeesNotOnLeaveList';
import { FeedbackModule } from '../../modules/app/feedback/FeedbackModule';
import { RequestModule } from '../../modules/app/request/RequestModule';

export const Routes = () => {
	const { accessToken } = useAuthStore();
	// NOTE: This still doesn't work (after expire, still won't redirect to 'app')
	const claims: JWT_Claims | undefined = accessToken
		? jwtDecode(accessToken)
		: undefined;
	const exp = claims && dayjs(claims.exp * 1000);
	const isExpAfterNow = exp && exp.isAfter(dayjs());
	const isLoggedIn = Boolean(isExpAfterNow);

	return (
		<ReactRouterRoutes>
			<Route
				path='*'
				element={<Navigate replace to={isLoggedIn ? 'app' : 'auth'} />}
			/>

			<Route path='auth' element={<AuthLayout />}>
				<Route index element={<Login />} />
				<Route path='login' element={<Login />} />
				<Route path='register-employee' element={<RegisterEmployee />} />
			</Route>

			<Route path='app' element={<ProtectedRoute element={<AppLayout />} />}>
				<Route index element={<Dashboard />} />

				<Route path='applicants' element={<ApplicantModule />} />
				<Route path='applicants/create' element={<CreateApplicantForm />} />
				<Route
					path='applicants/update/:NationalId'
					element={<UpdateApplicantForm />}
				/>
				<Route
					path='applicants/employ/:NationalId'
					element={<EmployApplicantForm />}
				/>

				<Route path='employees' element={<EmployeeModule />} />
				<Route path='employees/create' element={<CreateEmployeeForm />} />
				<Route
					path='employees/update/:NationalId'
					element={<UpdateEmployeeForm />}
				/>

				<Route path='qr' element={<QrDisplay />} />

				<Route path='attendances' element={<AttendanceModule />} />
				<Route
					path='attendances/daily'
					element={<DailyEmployeesNotOnLeaveList />}
				/>

				<Route path='positions' element={<PositionModule />} />
				<Route path='positions/create' element={<CreatePositionForm />} />
				<Route path='positions/update/:Name' element={<UpdatePositionForm />} />

				<Route path='requests' element={<RequestModule />} />

				<Route path='feedbacks' element={<FeedbackModule />} />

				<Route path='ex' element={<Example />} />
				<Route path='ex-form' element={<ExampleForm />} />
				<Route path='ex-table' element={<ExampleTable />} />
			</Route>
		</ReactRouterRoutes>
	);
};
