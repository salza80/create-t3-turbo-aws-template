import React from "react";
import type { GestureResponderEvent } from "react-native";
import { View } from "react-native";
import { Redirect } from "expo-router";
import { Button, Input } from "@rneui/themed";
import { Formik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { useSession } from "../../providers/sessionProvider/ctx";

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

const Login = () => {
  const { session, signIn } = useSession();
  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }

  const onSubmit = ({ email, password }: LoginFormValues) => {
    signIn(email, password);
  };
  return (
    <View className="flex-1 items-center justify-center">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(LoginFormSchema)}
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
              value={values.email}
              autoCapitalize="none"
            />
            <Input
              errorMessage={errors.password}
              label="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            <Button
              title="Sign In"
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

export default Login;
