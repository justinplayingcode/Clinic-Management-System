import "./index.scss"

import React from "react";
import "./index.scss";
import { Icon } from "@fluentui/react";

interface PagingProps {
	pageTotal: number;
	postPerPage?: number;
  disable?: boolean;
  currentPage: number;
  onChangeCurrentPage: any;
}
interface PagingState {
	arrPageNumbers: any[];
}

export default class Pagination extends React.Component<PagingProps, PagingState> {
	constructor(props: PagingProps) {
		super(props);
		this.state = {
			arrPageNumbers: [],
		};
	}

  handleChange = (value: number) => {
		this.props.onChangeCurrentPage(value);
	};


	handleNumberOfPage = () => {
		const numberOfPages: any[] = [];
		for (let i = 1; i <= this.props.pageTotal; i++) {
			numberOfPages.push(i);
		}
		if (this.props.pageTotal < 7) {
			return numberOfPages;
		} else {
			if (this.props.currentPage >= 1 && this.props.currentPage <= 3) {
				return [1, 2, 3, 4, "...", numberOfPages.length - 1, numberOfPages.length];
			} else if (this.props.currentPage > 3 && this.props.currentPage < numberOfPages.length - 2) {
				return [
					1,
					"...",
					this.props.currentPage - 1,
					this.props.currentPage,
					this.props.currentPage + 1,
					"...",
					numberOfPages.length,
				];
			} else {
				return [
					1,
					2,
					"...",
					numberOfPages.length - 3,
					numberOfPages.length - 2,
					numberOfPages.length - 1,
					numberOfPages.length,
				];
			}
		}
	};

	render() {
    const { pageTotal } = this.props;

		const arrPage = this.handleNumberOfPage();
    const disableComponent = pageTotal === 1 || this.props.disable
		return (
			<div className={`pagination-container ${disableComponent ? "disable" : ""} ${pageTotal > 1 ? "" : "hidden"}`}>
				<div
					className={`pagination-button ${this.props.currentPage === 1 ? "disabled" : ""}`}
					onClick={
						this.props.currentPage !== 1 ? () => this.handleChange(this.props.currentPage - 1) : () => {}
					}>
          <Icon className="pagination-icon" iconName={"ChevronLeftSmall"} />
				</div>
				{arrPage.map((value, index) => (
					<div
						className={`pagination-button ${this.props.currentPage === value ? "active" : ""} ${value === "..." ? "none" : ""}`}
						key={index}
						onClick={() => this.handleChange(value)}>
						{value}
					</div>
				))}
				<div
					className={`pagination-button ${this.props.currentPage === this.props.pageTotal ? "disabled" : ""}`}
					onClick={
						this.props.currentPage !== this.props.pageTotal
							? () => this.handleChange(this.props.currentPage + 1)
							: () => {}
					}>
					<Icon className="pagination-icon" iconName={"ChevronRightSmall"} />
				</div>
			</div>
		);
	}
}