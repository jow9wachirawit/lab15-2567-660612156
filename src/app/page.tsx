"use client";

import TermsAndCondsModal from "@components/TermsAndCondsModal";
import Footer from "@components/Footer";

import { useDisclosure } from "@mantine/hooks";
import { runningPlans } from "@lib/runningPlans";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  PasswordInput,
  Divider,
  Radio,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must have at least 3 characters" }),
    lastName: z
      .string()
      .min(3, { message: "Last name must have at least 3 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    plan: z.enum(["funrun", "mini", "half", "full"], {
      errorMap: () => ({ message: "Please select a plan" }),
    }),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Please choose a gender" }),
    }),
    acceptTermsAndConds: z.literal(true, {
      errorMap: () => ({
        message: "You must accept terms and conditions",
      }),
    }),
    hasCoupon: z.boolean(),
    coupon: z.string(),
    password: z.string().min(6, {message:"Password must contain at least 6 characters"}).max(12, {message:"Password must not exceed 12 characters"}),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (!data.hasCoupon) return true;
      if (data.hasCoupon && data.coupon === "CMU2023") return true;
      return false;
    },
    {
      message: "Invalid coupon code",
      path: ["coupon"],
    }
  ).refine(
    (data) => {
      if(data.confirmPassword != data.password) return false;
      return true;
    },
    {
      message: "Password does not match",
      path: ["confirmPassword"],
    }
  );

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      plan: null,
      gender: null,
      acceptTermsAndConds: false,
      hasCoupon: false,
      coupon: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(schema),
  });

  const computePrice = () => {
    let price = 0;
    const x = runningPlans.find((x) => x.value === form.values.plan)?.price;
    if(typeof x === "number") price = x;
    if(form.values.hasCoupon && form.values.coupon === "CMU2023") price *= 0.7;
    return price;
  };

  return (
    <div>
      <Container size="500px">
        <Space h="lg" />
        <Title fs="italic" ta="center" c="pink">
          Register CMU Marathon 🥈
        </Title>
        <Space h="lg" />

        {/* add form */}
        <form onSubmit={form.onSubmit(() => alert("See you at CMU Marathon"))}>
          <Stack gap="sm">
            <Group grow align="start">
              <TextInput
                label="First Name"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                {...form.getInputProps("lastName")}
              />
            </Group>
            <TextInput label="Email" {...form.getInputProps("email")} />

            <PasswordInput
              label="Password"
              description="Password must contain 6 - 12 characters"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm Password"
              {...form.getInputProps("confirmPassword")}
            />

            <Select
              label="Plan"
              data={runningPlans}
              placeholder="Please select plan..."
              {...form.getInputProps("plan")}
            />
            <Space />
            <Radio.Group label="Gender" {...form.getInputProps("gender")}>
              <Radio value="male" label="Male 👨" mb="xs" />
              <Radio value="female" label="Female 👧" />
            </Radio.Group>
            <Space />

            {/* Coupon section */}
            <Stack gap="5px">
              <Text size="sm" fw="bold">
                Coupon (30% discount)
              </Text>
              <Checkbox
                label="I have coupon"
                {...form.getInputProps("hasCoupon")}
              />
              {form.values.hasCoupon && (
                <TextInput label="Coupon" {...form.getInputProps("coupon")} />
              )}
            </Stack>

            <Text fw="bold">
              {" "}
              Total Price : {computePrice().toLocaleString()} BATH
            </Text>

            <Divider variant="dashed" />

            <Checkbox
              {...form.getInputProps("acceptTermsAndConds")}
              label={
                <Text>
                  I accept{" "}
                  <Anchor onClick={open} href="#">
                    terms and conditions
                  </Anchor>
                </Text>
              }
            />
            <Button type="submit">Register</Button>
          </Stack>
        </form>

        <Footer year={2024} fullName="Wachirawit Chaiyamat" studentId="660612156" />
      </Container>

      <TermsAndCondsModal opened={opened} close={close} />
    </div>
  );
}