import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = ({ values, errors, touched, status }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        console.log("status has changed", status);
        status && setUsers(users => [...users, status]);
    }, [status]);
    return (
        <div>
            <Form>
                <label htmlFor="name">Name:</label>
                <Field id="name" type="text" name="name" />
                {touched.name && errors.name && (
                    <p className="errors">{errors.name}</p>
                )}

                <label htmlFor="email">E-mail:</label>
                <Field id="email" type="text" name="email" />
                {touched.email && errors.email && <p className="errors">{errors.email}</p>}

                <label htmlFor="password">Password:</label>
                <Field id="password" type="text" name="password" />
                {touched.password && errors.password && <p className="errors">{errors.password}</p>}

                <label htmlFor="tos" className="checkbox-container">
                    Terms of Service
            <Field
                        id="tos"
                        type="checkbox"
                        name="tos"
                        checked={values.tos}
                    />
                    <span className="checkmark" />
                </label>
                {touched.tos && errors.tos && <p className="errors">{errors.tos}</p>}

                <button type="submit">Submit!</button>
            </Form>

            {users.map(user => (
                <ul key={user.id}>
                    <li>Name: {user.name}</li>
                    <li>E-mail: {user.email}</li>
                    <li>Password: {user.password}</li>
                </ul>
            ))}
        </div>
    );
};

const FormikForm = withFormik({
    mapPropsToValues({ name, email, password, tos }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            tos: tos || false,
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required("We Need Your Name!"),
        email: Yup.string().required("What's your E-mail!"),
        password: Yup.string().required("Don't Forget a Password!"),
        tos: Yup.boolean().oneOf([true], "You Must Agree to the Terms of Service!")
    }),
    handleSubmit(values, { setStatus, resetForm }) {
        console.log("submitting", values);
        axios
            .post("https://reqres.in/api/users/", values)
            .then(res => {
                console.log("success", res);
                setStatus(res.data);
                resetForm();
            })
            .catch(err => console.log(err.response));
    }
})(UserForm);

export default FormikForm;