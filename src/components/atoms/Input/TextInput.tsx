import { useFormContext } from 'react-hook-form';
import { DisplayConfigs, getLabelForField } from '../../../app/App.display';
import { ErrorIcon } from '../../../assets/icons/ErrorIcon';
import { Label } from './Label';

interface TextInputProps extends React.ComponentPropsWithRef<'input'> {
	name: string;
	label?: string;
	isVertical?: boolean;
	width: 'full' | 'medium' | 'small';
	displayConfigs?: DisplayConfigs;
}

export const TextInput = ({
	name,
	label,
	isVertical,
	width,
	displayConfigs,
	required,
	...props
}: TextInputProps) => {
	const { register, formState } = useFormContext();
	const error = formState.errors[name];

	// const hasLabel: boolean = !isNil(label);
	// const isNumber: boolean = type === 'number';

	return (
		<div
			className={`flex ${
				isVertical
					? ' flex-col items-start gap-1 '
					: ' flex-row items-center gap-2'
			}`}
		>
			{/* {hasLabel && <Label label={label} required={required} />} */}

			<Label
				label={
					label ??
					getLabelForField({
						labellers: displayConfigs!.labellers,
						field: name,
					})
				}
				required={required}
			/>

			<input
				className={
					' h-h-input rounded border bg-neutral-white px-2 py-1.5 text-neutral-gray-9 outline-none ' +
					` ${
						width === 'full'
							? 'w-full'
							: width === 'small'
							? ' w-[180px] '
							: 'w-w-input-medium'
					} ` +
					` ${error ? 'border-state-error-normal' : 'border-primary-normal'} ` +
					' hover:shadow focus:shadow ' +
					' disabled:cursor-not-allowed disabled:bg-neutral-gray-3 disabled:opacity-75 '
				}
				{...props}
				{...register(name, { valueAsNumber: false /* isNumber */ })}
			/>

			{error && (
				<div className='flex flex-row items-center gap-2 text-state-error-normal'>
					<ErrorIcon size={24} />
					<p>{error?.message?.toString()}</p>
				</div>
			)}
		</div>
	);
};
