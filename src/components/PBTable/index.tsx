import React from 'react';
import { PhoneEntry } from '../../models';
import ClipLoader from "react-spinners/ClipLoader";
import { orderBy } from 'lodash'
import './index.scss';

enum SortOrder {
  none = 0,
  ascending = 1,
  descending = 2,
}

export interface PBTableState {
  sortCol: string,
  sortOrder: SortOrder,
  isLoading: boolean,
  phoneNumbers: Array<PhoneEntry>,
  filteredPhoneNumbers: Array<PhoneEntry>,
  filSortedPhoneNumbers: Array<PhoneEntry>,
  filter: string,
}
export interface PBTableProps {
  phoneNumbers: Array<PhoneEntry>,
  isLoading: boolean,
  filter: string,
}

export class PBTable extends React.Component<PBTableProps, PBTableState> {
  static defaultProps: Partial<PBTableProps> = {};

  constructor(props: PBTableProps, context?: any) {
    super(props, context);

    this.state = {
      phoneNumbers: [],
      filSortedPhoneNumbers: [],
      filteredPhoneNumbers: [],
      sortCol: '',
      sortOrder: SortOrder.ascending,
      isLoading: props.isLoading,
      filter: props.filter,
    };
  }

  static getDerivedStateFromProps(nextProps: PBTableProps, prevState: PBTableState): Partial<PBTableState> | null {
    const newState: Partial<PBTableState> = {};

    if (nextProps.isLoading !== prevState.isLoading) {
      newState.isLoading = nextProps.isLoading;
    }

    if (nextProps.phoneNumbers !== prevState.phoneNumbers) {
      newState.phoneNumbers = nextProps.phoneNumbers;
    }

    if (nextProps.filter !== prevState.filter) {
      newState.filter = nextProps.filter;
    }

    if (newState.phoneNumbers || typeof (newState.filter) !== 'undefined') {
      newState.filteredPhoneNumbers = PBTable.applyFilter(newState.phoneNumbers || prevState.phoneNumbers,
        typeof (newState.filter) !== 'undefined' ? newState.filter : prevState.filter);
      newState.filSortedPhoneNumbers = PBTable.applySort(newState.filteredPhoneNumbers, prevState.sortCol || '', prevState.sortOrder);
    }

    return newState;
  }

  static applyFilter(values: Array<PhoneEntry>, filter: string): Array<PhoneEntry> {
    if (!filter.trim().length) {
      return values;
    }

    return values.filter(entry => (
      entry.phoneNumber.indexOf(filter) >= 0 ||
      entry.name.toLowerCase().indexOf(filter) >= 0 ||
      entry.address.toLowerCase().indexOf(filter) >= 0
    ));
  }

  static applySort(values: Array<PhoneEntry>, sortCol: string, sortOrder: SortOrder): Array<PhoneEntry> {
    if (!sortCol || sortOrder === SortOrder.none || !values.length) {
      return values;
    }

    return orderBy(values, [sortCol], [sortOrder === SortOrder.descending ? 'desc' : 'asc']);
  }

  getSortClassName(colName: string): string {
    const { sortCol, sortOrder } = this.state;
    if (sortCol === colName) {
      if (sortOrder === SortOrder.ascending) {
        return "sort-asc";
      }
      else if (sortOrder === SortOrder.descending) {
        return "sort-desc";
      }
    }

    return "";
  }

  handleColClick(colName: string, event: React.MouseEvent) {
    const { sortOrder, sortCol, filteredPhoneNumbers } = this.state;
    const newState: Partial<PBTableState> = { sortOrder, sortCol };

    if (sortCol === colName) {
      if (sortOrder === SortOrder.ascending) {
        newState.sortOrder = SortOrder.descending;
      } else if (sortOrder === SortOrder.descending) {
        newState.sortOrder = SortOrder.none;
      } else {
        newState.sortOrder = SortOrder.ascending;
      }
    } else {
      newState.sortCol = colName;
      newState.sortOrder = SortOrder.ascending;
    }

    newState.filSortedPhoneNumbers = PBTable.applySort(filteredPhoneNumbers, newState.sortCol || '', newState.sortOrder);

    this.setState({
      filSortedPhoneNumbers: newState.filSortedPhoneNumbers,
      sortOrder: newState.sortOrder,
      sortCol: newState.sortCol || '',
    });
  }

  render() {
    const { isLoading, filSortedPhoneNumbers } = this.state;

    if (isLoading) {
      return <div className="loader text-center">
        <ClipLoader
          size={50}
          color={"#123abc"}
          loading={true}
        />
      </div>;
    }

    return <table>
      <thead>
        <tr>
          <th>
            <span
              className={"col-head " + this.getSortClassName('name')}
              onClick={this.handleColClick.bind(this, 'name')}
            >Name</span>
          </th>
          <th>
            <span
              className={"col-head " + this.getSortClassName('phoneNumber')}
              onClick={this.handleColClick.bind(this, 'phoneNumber')}
            >Phone number</span>
          </th>
          <th>
            <span
              className={"col-head " + this.getSortClassName('address')}
              onClick={this.handleColClick.bind(this, 'address')}
            >Address</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {
          filSortedPhoneNumbers.length
            ? filSortedPhoneNumbers.map((phoneNumber, ind) => (<tr key={ind + phoneNumber.phoneNumber}>
              <td>{phoneNumber.name}</td>
              <td>{phoneNumber.phoneNumber}</td>
              <td>{phoneNumber.address}</td>
            </tr>))
            : <tr>
              <td id="no-results" colSpan={3}>No results found</td>
            </tr>
        }
      </tbody>
    </table>;
  }
}
