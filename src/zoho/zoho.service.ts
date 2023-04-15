import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class ZohoService {
  async getAccessToken(): Promise<any> {
    const response = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=http://www.zoho.com/books/&grant_type=refresh_token`
    );
    return response.data;
  }

  async createContact(
    accessToken: string,
    data: {
      contact_name: string;
      company_name: string;
    }
  ): Promise<any> {
    const headers = {
      "X-com-zoho-invoice-organizationid": process.env.ORGANIZATION_ID,
      Authorization: "Zoho-oauthtoken " + accessToken,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://www.zohoapis.com/books/v3/contacts",
      data,
      { headers }
    );
    return response.data;
  }

  async createItem(
    accessToken: string,
    data: {
      name: string;
      rate: number;
    }
  ): Promise<any> {
    const headers = {
      "X-com-zoho-invoice-organizationid": process.env.ORGANIZATION_ID,
      Authorization: "Zoho-oauthtoken " + accessToken,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://www.zohoapis.com/books/v3/items",
      data,
      { headers }
    );
    return response.data;
  }

  async createInvoice(
    accessToken: string,
    data: {
      customer_id: string;
      date: string;
      line_items: {
        item_id: string;
        rate: string;
        quantity: number;
      }[];
      custom_fields: {
        label: string;
        value: any;
      }[];
    }
  ): Promise<any> {
    try {
      const headers = {
        "X-com-zoho-invoice-organizationid": process.env.ORGANIZATION_ID,
        Authorization: "Zoho-oauthtoken " + accessToken,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        "https://www.zohoapis.com/books/v3/invoices",
        data,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.log(error.response);
    }
  }

  async setInvoiceStatus(
    accessToken: string,
    data: {
      invoice_id: string;
    }
  ): Promise<any> {
    const headers = {
      "X-com-zoho-invoice-organizationid": process.env.ORGANIZATION_ID,
      Authorization: "Zoho-oauthtoken " + accessToken,
      "Content-Type": "application/json",
    };

    console.log(data.invoice_id);

    const response = await axios.post(
      `https://www.zohoapis.com/books/v3/invoices/${data.invoice_id}/status/sent`,
      {},
      { headers }
    );
    return response.data;
  }

  async sendInvoice(
    accessToken: string,
    data: {
      send_from_org_email_id: boolean;
      to_mail_ids: string[];
      subject: string;
      body: string;
      invoice_id: string;
    }
  ): Promise<any> {
    const headers = {
      "X-com-zoho-invoice-organizationid": process.env.ORGANIZATION_ID,
      Authorization: "Zoho-oauthtoken " + accessToken,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `https://www.zohoapis.com/books/v3/invoices/${data.invoice_id}/email`,
      data,
      { headers }
    );
    return response.data;
  }
}
