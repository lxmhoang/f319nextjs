import { SearchUseFormState, searchUserForPayment } from "@/app/lib/action";
import { Button } from "@nextui-org/react";
import { useFormState } from "react-dom";
const initialState = { message: "", errors: {} };

export default function SearchUserForm({ state, dispatch, fields }: {
    state: SearchUseFormState, dispatch: (payload: FormData) => void, fields: {
        name: string,
        placeHolder: string,
        type: string
    }[]
}) {

    //   const [searchState, dispatchSearch] = useFormState(searchUserForPayment, initialState);
    return (

        <form action={dispatch} className='p-4'>
            {fields.map((field, index) => {
                return (
                    <div key={index}>
                        <div className="mb-4">
                            <input
                            key={field.name}
                                name={field.name}
                                className="peer w-3/4  rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
                                placeholder={field.placeHolder}
                                // startContent={<HeartIcon size={18} />}
                                type={field.type}
                            />
                        </div>
                        <div id="customer-error" aria-live="polite" aria-atomic="true">
                            { state.errors && state.errors[field.name]&&
                                state.errors[field.name].map(
                                    (error: string) => {
                                        return (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        )
                                    }
                                )
                            }
                
                        </div>

                    </div>

                )

            })}



            <Button type="submit">Search</Button>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
                {state.errors?.general &&
                    state.errors?.general.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                        </p>
                    ))}
            </div>
        </form>
    )
}