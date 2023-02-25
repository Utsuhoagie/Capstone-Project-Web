import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToastStore } from '../../../../app/App.store';
import { Button } from '../../../../components/atoms/Button/Button';
import { DateInput } from '../../../../components/atoms/Input/DateInput/DateInput';
import { SelectInput } from '../../../../components/atoms/Input/SelectInput';
import { TextInput } from '../../../../components/atoms/Input/TextInput';
import { Applicant } from '../../ApplicantTracking.interface';
import { useApplicantTrackingStore } from '../../ApplicantTracking.store';
import {
	UpdateApplicantFormIntermediateValues,
	updateApplicantFormSchema,
} from './UpdateApplicantForm.form';

export const UpdateApplicantForm = () => {
	const navigate = useNavigate();

	const selectedApplicant = useApplicantTrackingStore(
		(state) => state.selectedApplicant
	) as Applicant;

	const queryClient = useQueryClient();
	const mutation = useMutation(
		'applicant-tracking/update',
		async (formData: Applicant) => {
			const res = await fetch(
				`https://localhost:5000/api/ApplicantTracking/Update?NationalId=${selectedApplicant.NationalId}`,
				{
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					method: 'PUT',
					body: JSON.stringify(formData),
				}
			);

			if (res.ok) {
				showToast({ state: 'success' });
			} else {
				showToast({ state: 'error' });
			}
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('applicant-tracking');
			},
		}
	);

	const showToast = useToastStore((state) => state.showToast);

	const methods = useForm<UpdateApplicantFormIntermediateValues>({
		mode: 'onSubmit',
		defaultValues: {
			NationalId: selectedApplicant.NationalId,
			FullName: selectedApplicant.FullName,
			Gender: selectedApplicant.Gender,
			BirthDate: dayjs(selectedApplicant.BirthDate).toDate(),
			Address: selectedApplicant.Address,
			Phone: selectedApplicant.Phone,
			Email: selectedApplicant.Email,
			ExperienceYears: `${selectedApplicant.ExperienceYears}`,
			AppliedPosition: selectedApplicant.AppliedPosition,
			AppliedDate: dayjs(selectedApplicant.AppliedDate).toDate(),
			AskingSalary: `${selectedApplicant.AskingSalary}`,
		},
		resolver: zodResolver(updateApplicantFormSchema),
	});

	const displayConfigs = useApplicantTrackingStore(
		(state) => state.displayConfigs
	);

	const handleSubmit: SubmitHandler<UpdateApplicantFormIntermediateValues> = (
		rawData
	) => {
		console.log(rawData);

		const formData: Applicant = {
			NationalId: rawData.NationalId,
			FullName: rawData.FullName,
			Gender: rawData.Gender,
			BirthDate: rawData.BirthDate,
			Address: rawData.Address,
			Phone: rawData.Phone,
			Email: rawData.Email,
			ExperienceYears: parseInt(rawData.ExperienceYears),
			AppliedPosition: rawData.AppliedPosition,
			AppliedDate: rawData.AppliedDate,
			AskingSalary: parseInt(rawData.AskingSalary),
		};

		// console.log({ formData });
		mutation.mutate(formData);
	};
	const handleError = (error) => {
		console.log({ error });
	};

	return (
		<div className='flex flex-col gap-4'>
			<h1 className='text-h1'>Thêm hồ sơ Ứng viên mới</h1>
			<FormProvider {...methods}>
				<form
					className='flex flex-col gap-2 p-2'
					onSubmit={methods.handleSubmit(handleSubmit, handleError)}
				>
					<TextInput
						required
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
						options={['male', 'female', 'other']}
						displayConfigs={displayConfigs}
					/>

					<DateInput
						name='BirthDate'
						placeholder='Chọn ngày sinh.'
						width='medium'
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
						name='Email'
						placeholder='Nhập địa chỉ email.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						type='number'
						name='ExperienceYears'
						placeholder='Nhập số năm kinh nghiệm.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						name='AppliedPosition'
						placeholder='Nhập vị trí ứng tuyển.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<DateInput
						required
						name='AppliedDate'
						placeholder='Chọn ngày nộp hồ sơ ứng tuyển.'
						width='medium'
						displayConfigs={displayConfigs}
					/>

					<TextInput
						required
						type='number'
						name='AskingSalary'
						width='medium'
						placeholder='Nhập mức lương đề nghị.'
						displayConfigs={displayConfigs}
					/>

					<Button type='submit' width='medium'>
						Thêm
					</Button>
					<Button
						type='button'
						width='medium'
						onClick={() => console.log('getValues', methods.getValues())}
					>
						Xem form
					</Button>
					<Button
						type='button'
						secondary
						width='medium'
						onClick={() => navigate('/app/applicant-tracking?page=2')}
					>
						Thoát
					</Button>
				</form>
			</FormProvider>
		</div>
	);
};