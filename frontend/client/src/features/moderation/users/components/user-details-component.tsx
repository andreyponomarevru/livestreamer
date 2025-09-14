import React from "react";

import { type User } from "../../../../types";
import { Btn } from "../../../ui/btn";
import { Loader } from "../../../ui/loader/loader";

import "./user-meta.scss";

export function UserDetails(props: User) {
  const [isOpen, setIsOpen] = React.useState(false);

  function toggleDetails() {
    setIsOpen((prev) => !prev);
  }

  const detailsJSX = (
    <ul className="user-meta__details">
      <li className="user-meta__details-row">
        <span className="user-meta__key">ID</span>
        <span className="user-meta__value">{props.id}</span>
      </li>
      <li className="user-meta__details-row">
        <span className="user-meta__key">Username</span>
        <span className="user-meta__value">{props.username}</span>
      </li>
      <li className="user-meta__details-row">
        <span className="user-meta__key">Email</span>
        <span className="user-meta__value">{props.email}</span>
      </li>
      <li className="user-meta__details-row">
        <span className="user-meta__key">Created At</span>
        <span className="user-meta__value">
          {props.createdAt ? new Date(props.createdAt).toDateString() : ""}
        </span>
      </li>
      <li className="user-meta__details-row">
        <span className="user-meta__key">Last Login At</span>
        <span className="user-meta__value">
          {props.lastLoginAt ? new Date(props.lastLoginAt).toDateString() : ""}
        </span>
      </li>
      <li className="user-meta__details-row">
        <span className="user-meta__key">Is Email Confirmed:</span>
        <span className="user-meta__value">
          {String(props.isEmailConfirmed)}
        </span>
      </li>
      <li className="user-meta__details-row">
        <span className="user-meta__key">Is Deleted</span>
        <span className="user-meta__value">{String(props.isDeleted)}</span>
      </li>

      <li className="user-meta__details-row">
        <Btn theme="white" name="Delete" isLoading={false}>
          <Loader color="black" for="btn" />
        </Btn>
      </li>
    </ul>
  );

  return (
    <div className="user-meta">
      <button className="user-meta__btn" onClick={toggleDetails}>
        {props.username}
        <span>+</span>
      </button>
      {isOpen && detailsJSX}
    </div>
  );
}
