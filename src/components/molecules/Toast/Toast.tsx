import { useEffect, useState } from 'react';
import { useToastStore } from '../../../app/App.store';

export const Toast = () => {
	// const { isOpen, state, timeoutId, showToast, hideToast, setTimeoutId } =
	const { isOpen, state, hideToast } = useToastStore((state) => state);

	const isSuccess = state === 'success';
	const isError = state === 'error';

	useEffect(() => {
		console.log({ isOpen }, ' changed once');
		if (isOpen) {
			setTimeout(() => {
				hideToast();
			}, 5000);
		}
	}, [isOpen]);

	return (
		<div
			className={
				' fixed right-4 bottom-4 max-h-h-toast max-w-[240px] border p-2 ' +
				`${isOpen ? '' : ' hidden '}` +
				`${
					isSuccess
						? ' border-state-success-dark bg-state-success-bright '
						: isError
						? ' border-state-error-dark bg-state-error-bright '
						: ''
				}`
			}
		>
			{isSuccess && <p>Thành công</p>}
			{isError && <p>Thất bại</p>}
		</div>
	);
};
