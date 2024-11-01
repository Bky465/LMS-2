import * as Yup from 'yup';
import { createValidationSchema } from "@/schemas/schemas"

const handleVallidation = async (data, setError) => {
    let newErrors;
    try {
        // Create validation schema dynamically based on signin formData state
        const validationSchema = createValidationSchema(data);
        // Validate form data with Yup schema
        await validationSchema.validate(data, { abortEarly: false });
        // If validation passes, clear errors and handle successful form submission
        setError({})
    } catch (err) {
        if (err instanceof Yup.ValidationError) {
            // Collect validation errors
             newErrors = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message;
                return acc;
            }, {});
            setError(newErrors);
        }

    }

    return newErrors
}
export default handleVallidation;