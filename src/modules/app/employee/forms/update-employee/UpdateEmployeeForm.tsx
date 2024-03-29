import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IS_DEBUG_MODE } from '../../../../../app/App';
import { convertFromDomainObjToFormData } from '../../../../../app/App.form';
import {
	useConfirmDialogStore,
	useToastStore,
} from '../../../../../app/App.store';
import { Button } from '../../../../../components/atoms/Button/Button';
import { DateInput } from '../../../../../components/atoms/Input/DateTimeInput/DateInput';
import { TimeInput } from '../../../../../components/atoms/Input/DateTimeInput/TimeInput';
import { FileInput } from '../../../../../components/atoms/Input/FileInput/FileInput';
import { ImageInput } from '../../../../../components/atoms/Input/ImageInput/ImageInput';
import { SelectInput } from '../../../../../components/atoms/Input/SelectInput/SelectInput';
import { useSelectOptions } from '../../../../../components/atoms/Input/SelectInput/SelectInput.hooks';
import { TextInput } from '../../../../../components/atoms/Input/TextInput';
import { API } from '../../../../../config/axios/axios.config';
import { useAuthStore } from '../../../../auth/Auth.store';
import { EMPLOYEE_MAPPERS } from '../../Employee.display';
import {
	Employee,
	Employee_API_Request,
	mapToEmployee,
} from '../../Employee.interface';
import { useEmployeeStore } from '../../Employee.store';
import {
	UpdateEmployeeFormIntermediateValues,
	updateEmployeeFormSchema,
} from './UpdateEmployeeForm.form';

export const UpdateEmployeeForm = () => {
	const navigate = useNavigate();
	const { accessToken } = useAuthStore();
	const { showToast } = useToastStore();
	const { openConfirmDialog } = useConfirmDialogStore();
	const { displayConfigs } = useEmployeeStore();
	const { NationalId } = useParams();
	const positionOptions = useSelectOptions({ module: 'Positions' });

	const queryClient = useQueryClient();
	const mutation = useMutation(
		'employees/update',
		async (formData: FormData) => {
			const res = await API.put(`/Employees/Update/${NationalId}`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			showToast({ state: 'success' });
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('employees');
				queryClient.invalidateQueries('files');
			},
		}
	);

	const methods = useForm<UpdateEmployeeFormIntermediateValues>({
		mode: 'onSubmit',
		defaultValues: async () => {
			const res = await API.get(`Employees/${NationalId}`);

			if (res.status >= 300) {
				console.log('not OK');
				return {
					NationalId: '',
					FullName: '',
					Gender: 'male',
					BirthDate: '',
					Address: '',
					Phone: '',
					Email: '',
					ExperienceYears: '',
					PositionName: '',
					EmployedDate: dayjs().toISOString(),
					Salary: '',
				};
			}

			const selectedEmployee = mapToEmployee(res.data);
			const imageRes = selectedEmployee.ImageFileName
				? await API.get(
						`Files/Image/Employees/${selectedEmployee.ImageFileName}`,
						{ responseType: 'blob' }
				  )
				: undefined;
			const resumeRes = selectedEmployee.ResumeFileName
				? await API.get(
						`Files/Document/Employees/${selectedEmployee.ResumeFileName}`,
						{ responseType: 'blob' }
				  )
				: undefined;

			console.log('OK', selectedEmployee);
			return {
				NationalId: selectedEmployee.NationalId,
				FullName: selectedEmployee.FullName,
				Gender: selectedEmployee.Gender,
				BirthDate: selectedEmployee.BirthDate
					? dayjs(selectedEmployee.BirthDate).toISOString()
					: '',
				Address: selectedEmployee.Address,
				Phone: selectedEmployee.Phone,
				Email: selectedEmployee.Email,
				ExperienceYears: `${selectedEmployee.ExperienceYears}`,
				PositionName: selectedEmployee.PositionName,
				EmployedDate: dayjs(selectedEmployee.EmployedDate).toISOString(),
				Salary: `${selectedEmployee.Salary}`,
				Image: imageRes?.data
					? new File([imageRes.data], `${selectedEmployee.NationalId}.jpeg`)
					: undefined,
				Resume: resumeRes?.data
					? new File([resumeRes.data], `${selectedEmployee.NationalId}.pdf`)
					: undefined,
			};
		},
		resolver: zodResolver(updateEmployeeFormSchema),
	});

	console.table(methods.formState.defaultValues);

	const handleSubmit: SubmitHandler<UpdateEmployeeFormIntermediateValues> = (
		rawData
	) => {
		console.log(rawData);

		const req: Employee_API_Request = {
			NationalId: rawData.NationalId,
			FullName: rawData.FullName,
			Gender: rawData.Gender,
			BirthDate: rawData.BirthDate
				? dayjs(rawData.BirthDate).toDate()
				: undefined,
			Address: rawData.Address,
			Phone: rawData.Phone,
			Email: rawData.Email,
			ExperienceYears: parseInt(rawData.ExperienceYears),
			PositionName: rawData.PositionName,
			EmployedDate: dayjs(rawData.EmployedDate).toDate(),
			Salary: parseInt(rawData.Salary),
			HasUser: false,
			Image: rawData.Image,
			Resume: rawData.Resume,
		};

		const formData = convertFromDomainObjToFormData(req);
		// console.log({ formData });
		openConfirmDialog({
			isClosable: true,
			// title,
			message: 'Xác nhận cập nhật hồ sơ nhân viên này?',
			onConfirm: () => {
				mutation.mutate(formData);
				navigate('/app/employees');
			},
			onSuccess: () => {
				window.alert('aaaaaa');
			},
		});
	};
	const handleError = (error) => {
		console.log({ error });
	};

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-h1'>Chỉnh sửa hồ sơ Nhân viên</h1>
			<FormProvider {...methods}>
				<form
					className='flex flex-col gap-2 p-2'
					onSubmit={methods.handleSubmit(handleSubmit, handleError)}
				>
					<div className='flex flex-row justify-between'>
						<div className='flex flex-col gap-2'>
							<TextInput
								required
								disabled
								name='NationalId'
								placeholder='Nhập 9 hoặc 12 số.'
								width='medium'
								displayConfigs={displayConfigs}
							/>
							<TextInput
								required
								name='FullName'
								placeholder='Nhập họ tên đầy đủ.'
								width='medium'
								displayConfigs={displayConfigs}
							/>
							<SelectInput
								required
								name='Gender'
								placeholder='Chọn 1.'
								width='medium'
								optionPairs={EMPLOYEE_MAPPERS['Gender']}
								displayConfigs={displayConfigs}
							/>
							<DateInput
								name='BirthDate'
								placeholder='Chọn ngày sinh.'
								width='medium'
								maxDate={dayjs().subtract(18, 'year').toDate()}
								openToDate={dayjs().year(2000).startOf('year').toDate()}
								displayConfigs={displayConfigs}
							/>
							<TextInput
								required
								name='Address'
								placeholder='Số nhà, Đường, Phường/Xã, Tỉnh/Thành phố'
								width='medium'
								displayConfigs={displayConfigs}
							/>
							<TextInput
								required
								name='Phone'
								placeholder='Nhập số điện thoại.'
								width='medium'
								displayConfigs={displayConfigs}
							/>
							<TextInput
								required
								disabled
								name='Email'
								placeholder='Nhập địa chỉ email.'
								width='medium'
								displayConfigs={displayConfigs}
							/>
							<TextInput
								required
								name='ExperienceYears'
								type='number'
								placeholder='Nhập số năm kinh nghiệm.'
								width='medium'
								displayConfigs={displayConfigs}
							/>
							<SelectInput
								required
								name='PositionName'
								placeholder='Nhập vị trí.'
								width='medium'
								optionPairs={positionOptions}
								displayConfigs={displayConfigs}
							/>
							<DateInput
								required
								name='EmployedDate'
								placeholder='Chọn ngày bắt đầu làm việc.'
								width='medium'
								displayConfigs={displayConfigs}
							/>
							<TextInput
								required
								name='Salary'
								type='number'
								width='medium'
								placeholder='Nhập mức lương.'
								displayConfigs={displayConfigs}
							/>
						</div>

						<div className='flex flex-col gap-2'>
							<ImageInput name='Image' />
							<FileInput name='Resume' />
						</div>
					</div>

					<Button type='submit' width='medium'>
						Cập nhật
					</Button>
					{IS_DEBUG_MODE && (
						<Button
							type='button'
							width='medium'
							onClick={() => console.log('getValues', methods.getValues())}
						>
							Xem form
						</Button>
					)}
					<Button
						type='button'
						variant='secondary'
						width='medium'
						onClick={() => navigate('/app/employees')}
					>
						Thoát
					</Button>
				</form>
			</FormProvider>
		</div>
	);
};
