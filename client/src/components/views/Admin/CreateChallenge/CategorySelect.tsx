import React from "react";
import { CreateChallengeRequestDtoCategoryEnum } from "../../../../api";

export default function CategorySelect(props: {
  setCategory: React.Dispatch<
    React.SetStateAction<CreateChallengeRequestDtoCategoryEnum>
  >;
}) {
  return (
    <div className="form-floating mb-4">
      <select
        id="category-select"
        className="mb-4 form-select"
        onChange={handleCategorySelect(props.setCategory)}
      >
        <option
          defaultChecked
          value={CreateChallengeRequestDtoCategoryEnum.Forensic}
        >
          {CreateChallengeRequestDtoCategoryEnum.Forensic}
        </option>
        <option value={CreateChallengeRequestDtoCategoryEnum.Misc}>
          {CreateChallengeRequestDtoCategoryEnum.Misc}
        </option>
        <option value={CreateChallengeRequestDtoCategoryEnum.Pwnable}>
          {CreateChallengeRequestDtoCategoryEnum.Pwnable}
        </option>
        <option value={CreateChallengeRequestDtoCategoryEnum.Reversing}>
          {CreateChallengeRequestDtoCategoryEnum.Reversing}
        </option>
        <option value={CreateChallengeRequestDtoCategoryEnum.Web}>
          {CreateChallengeRequestDtoCategoryEnum.Web}
        </option>
      </select>
      <label htmlFor="category-select">category</label>
    </div>
  );
}

function handleCategorySelect(
  setFunction: React.Dispatch<
    React.SetStateAction<CreateChallengeRequestDtoCategoryEnum>
  >
) {
  return (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.value) {
      case CreateChallengeRequestDtoCategoryEnum.Forensic:
        return setFunction(CreateChallengeRequestDtoCategoryEnum.Forensic);
      case CreateChallengeRequestDtoCategoryEnum.Misc:
        return setFunction(CreateChallengeRequestDtoCategoryEnum.Misc);
      case CreateChallengeRequestDtoCategoryEnum.Pwnable:
        return setFunction(CreateChallengeRequestDtoCategoryEnum.Pwnable);
      case CreateChallengeRequestDtoCategoryEnum.Reversing:
        return setFunction(CreateChallengeRequestDtoCategoryEnum.Reversing);
      case CreateChallengeRequestDtoCategoryEnum.Web:
        return setFunction(CreateChallengeRequestDtoCategoryEnum.Web);
    }
  };
}
