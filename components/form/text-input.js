import React from 'react';
import { useField } from 'formik';

const MyTextInput = ({ label, ...props }) => {
	// useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
	// which we can spread on <input>. We can use field meta to show an error
	// message if the field is invalid and it has been touched (i.e. visited)
	const [field, meta] = useField(props);
	
	return (
		<div className="field mb-5">
			<label className="label" htmlFor={props.id || props.name}>{label}</label>
			
			<div className="control">
				<input className="input" {...field} {...props} />
				{meta.touched && meta.error ? (
					<div className="error">{meta.error}</div>
				) : null} 
			</div>
		</div>
	);
};

export default MyTextInput;
 