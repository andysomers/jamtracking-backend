import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Skater } from "../../types/Skater";

interface Props {
  skater?: Skater;
}

interface SaveParams {
  values: Skater;
}

interface DeleteParams {
  id: string;
}

const saveSkater = async ({ values }: SaveParams) =>
  await fetch<Skater>(!values["@id"] ? "/skaters" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteSkater = async (id: string) =>
  await fetch<Skater>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ skater }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Skater> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveSkater(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Skater> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteSkater(id), {
    onSuccess: () => {
      router.push("/skaters");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!skater || !skater["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: skater["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/skaters"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {skater ? `Edit Skater ${skater["@id"]}` : `Create Skater`}
      </h1>
      <Formik
        initialValues={
          skater
            ? {
                ...skater,
              }
            : new Skater()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/skaters");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="skater_number"
              >
                number
              </label>
              <input
                name="number"
                id="skater_number"
                value={values.number ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.number && touched.number ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.number && touched.number ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="number"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="skater_name"
              >
                name
              </label>
              <input
                name="name"
                id="skater_name"
                value={values.name ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.name && touched.name ? "border-red-500" : ""
                }`}
                aria-invalid={errors.name && touched.name ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="name"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="skater_jammer"
              >
                jammer
              </label>
              <input
                name="jammer"
                id="skater_jammer"
                value={values.jammer ?? ""}
                type="checkbox"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.jammer && touched.jammer ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.jammer && touched.jammer ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="jammer"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="skater_pivot"
              >
                pivot
              </label>
              <input
                name="pivot"
                id="skater_pivot"
                value={values.pivot ?? ""}
                type="checkbox"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.pivot && touched.pivot ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.pivot && touched.pivot ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="pivot"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">team</div>
              <FieldArray
                name="team"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="skater_team">
                    {values.team && values.team.length > 0 ? (
                      values.team.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`team.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {skater && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
