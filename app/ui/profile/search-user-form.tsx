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
            {/* <div className="relative mb-4">
          <select
            onChange={selectChange}
            id="tranType"
            name="tranType"
            className="peer block w-50 cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 
            text-sky-500 placeholder:text-gray-500"
            defaultValue="deposit"
            aria-describedby="customer-error"
          >
            <option value="" disabled>
              Chọn loại transaction
            </option>
            <option key="1" value="deposit">
              Nap tien
            </option>
            <option key="2" value="withDraw" disabled>
              Rut tien
            </option>
            <option key="3" value="p2p" disabled>
              P2P
            </option>
          </select>
          <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div> */}
            {fields.map((field, index) => {
                return (
                    <div key={index}>
                        <div className="mb-4">
                            <input
                            key={field.name}
                                name={field.name}
                                className="peer block w-1/3 rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
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
            {/* <div>
                <div className="mb-4">
                    <input
                        name="paymentId"
                        className="peer block w-1/3 rounded-md boreder border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-grey-500 text-sky-500"
                        placeholder="Nhap paymentID"
                        // startContent={<HeartIcon size={18} />}
                        type="search"
                    />
                </div>
                <div id="customer-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.paymentId &&
                        state.errors.paymentId.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div> */}


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