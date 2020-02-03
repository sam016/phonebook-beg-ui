import React from 'react';
import { ApiService } from '../../services'
import { PhoneEntry } from '../../models';
import { PBTable } from '../../components/PBTable';
import './index.scss';

export interface PhoneBookState {
  phoneNumbers: Array<PhoneEntry>,
  isLoading: boolean,
  filter: string,
}
export interface PhoneBookProps { }

export class PhoneBook extends React.Component<PhoneBookProps, PhoneBookState> {
  static defaultProps: Partial<PhoneBookProps> = {};

  constructor(props: PhoneBookProps, context?: any) {
    super(props, context);

    this.state = {
      filter: "",
      phoneNumbers: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    ApiService.getPhoneNumbers()
      .then(phoneNumbers => {
        this.setState({ phoneNumbers: phoneNumbers });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ filter: event.target.value.toLowerCase() });
  }

  render() {
    const { isLoading, phoneNumbers, filter } = this.state;

    return <div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search..."
          disabled={isLoading}
          onChange={this.handleFilterChange.bind(this)}
        />
      </div>
      <PBTable
        isLoading={isLoading}
        phoneNumbers={phoneNumbers}
        filter={filter}
      ></PBTable>
    </div>;
  }
}
