
'use client'

import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

import { user_role } from "@/lib/data";

import { handleAxiosError } from "@/lib/handleAxiosError";

export default function AddNewMember() {


    const {

        register,
        formState: { errors },
        reset,
        handleSubmit,

    } = useForm();


    async function handleSubmit(data) {

        try {

            console.log("form data is ", data);

        } catch (error) {

            console.log("error is ", error);

            handleAxiosError(error);
        }
    }

    return (

        <div>

            <div className="flex flex-col gap-3">

                <h1>Add New Member </h1>

                <form onSubmit={handleSubmit(handleSubmit)}>


                    <div>

                        <Label className="block mb-1">User Name</Label>

                        <Input

                            {...register("name", {
                                required: "name is required",

                            })}

                        />

                        {errors?.name && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.name.message}
                            </p>

                        )}

                    </div>

                    <div>

                        <Label className="block mb-1">User Email</Label>

                        <Input

                            {...register("email", {
                                required: "email is required",

                            })}

                        />

                        {errors?.email && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.email.message}
                            </p>

                        )}

                    </div>


                    <div>

                        <Label className="block mb-1">Password</Label>

                        <Input

                            {...register("password", {
                                required: "email is required",

                            })}

                        />

                        {errors?.password && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.password.message}
                            </p>

                        )}

                    </div>

                    {/* select role  */}

                    <div>

                        <Select

                            {...register("role", {
                                required: "role is required "
                            })}


                        >

                            <option>

                                {

                                    Object.values(user_role).map((role) => (

                                        <option key={role} value={role}>{role}</option>
                                    ))
                                }

                            </option>


                        </Select>

                    </div>



                </form>

            </div>



        </div>
    )

}

