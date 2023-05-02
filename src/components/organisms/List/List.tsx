import { DisplayConfigs } from '../../../app/App.display';
import { ListItemConfigs } from './List.interface';
import { ListItem } from './ListItem';

export interface ListProps {
	data: any;
	displayConfigs: DisplayConfigs;
	listItemConfigs: ListItemConfigs;
}

export const List = ({ data, displayConfigs, listItemConfigs }: ListProps) => {
	return (
		<div className='flex w-full flex-col divide-y divide-neutral-gray-5'>
			{Object.keys(listItemConfigs).map((field) => (
				<ListItem
					key={field}
					displayConfigs={displayConfigs}
					itemData={{ field: field, value: data[field] }}
				/>
			))}
		</div>
	);
};
