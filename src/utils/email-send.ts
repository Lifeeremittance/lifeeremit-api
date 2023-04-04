import axios from "axios";

const BASE_URL = "https://api.sendgrid.com/v3";

export const EMAIL_TEMPLATES = {
  WELCOME: "d-56779313735f468d92767007688ddecb",
  LOGIN: "d-04c7b0c5c7854535bb55737002473458",
  PAYMENT_DETAILS: "d-1059646c92e14a8ba33f4e80438cca79",
  CUSTOMER_RECEIPT: "d-58a96954fba444c89e9776b92e348a35",
  PRODUCT_RECEIPT: "d-2a7f7885d662434984bfe693279baa0a",
};

export const sendNotification = async ({
  templateId,
  recipient,
  substitutions,
}: {
  templateId: string;
  recipient: string;
  substitutions?: any;
}) => {
  return axios.post(
    `${BASE_URL}/mail/send`,
    {
      from: {
        email: "lifeeremit@gmail.com",
      },
      personalizations: [
        {
          to: [
            {
              email: recipient,
            },
          ],
          dynamic_template_data: substitutions,
        },
      ],
      template_id: templateId,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MAIL_PASSWORD}`,
        "Content-Type": "application/json",
      },
    }
  );
};
