import React from "react";
import type { GestureResponderEvent } from "react-native";
import { View } from "react-native";
import { Redirect } from "expo-router";
import { Button, Input } from "@rneui/themed";
import { Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useSession } from "../../providers/sessionProvider/ctx";

const RegisterFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

const Register = () => {
  const { session, register } = useSession();
  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }

  const onSubmit = ({ email, name, password }: RegisterFormValues) => {
    register(email, name, password);
  };
  const initialValues: RegisterFormValues = {
    email: "",
    name: "",
    password: "",
  };
  return (
    <View className="flex-1 items-center justify-center">
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(RegisterFormSchema)}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View className="w-2/3">
            <Input
              errorMessage={errors.email}
              label="Email"
              //leftIcon={<Icon name="account-outline" size={20} />}
              //onChangeText={(text) => setEmail(text)}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              autoCapitalize="none"
              value={values.email}
            />
            <Input
              errorMessage={errors.name}
              label="Name"
              //leftIcon={<Icon name="account-outline" size={20} />}
              //onChangeText={(text) => setEmail(text)}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              autoCapitalize="none"
              value={values.name}
            />
            <Input
              label="Password"
              errorMessage={errors.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            <Button
              title="Register"
              onPress={
                handleSubmit as unknown as (e: GestureResponderEvent) => void
              }
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Register;
