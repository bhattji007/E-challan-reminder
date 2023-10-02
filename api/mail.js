import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';

function findNumericValues(str) {
  const numericValues = str.match(/\d+(\.\d+)?/g);
  return numericValues ? numericValues.map(Number) : [];
}

const sendEmail = async (email, vehicle, pendingChallans, formattedDate, formattedTime) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: 'challanDeets@gmail.com',
      to: email,
      subject: 'Vehicle Information and Pending Challans',
      text: `Dear User: ${email} ,\n\n
        We hope this email finds you well.\n
        We are writing to provide you with important information regarding your vehicle \n
        and any pending challans associated with it. Below are the details:\n\n
        Vehicle Information:\n\
        Vehicle Number: ${vehicle}\n\n
        Pending Challans: \n\
        Number of Pending Challans: ${pendingChallans.length}\n
        ChallanID: ${pendingChallans}\n
        This Mail was sent on ${formattedDate} at ${formattedTime} \n
        Thank you for your attention to this matter.\n\n
        Sincerely,\n
        E-Challan Reminder`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return 'Email sent successfully!';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('An error occurred while sending the email.');
  }
};

const processChallanDetails = (challanDetailsHeading) => {
  const Challans = findNumericValues(challanDetailsHeading);
  return Challans[0] || 0;
};

const extractTableData = (tables) => {
  const tableDataArray = [];

  tables.forEach((table) => {
    const firstRowData = table.querySelector('tr:first-child td');
    const lastRowData = table.querySelector('tr:last-child td:last-child');

    const rowData = {
      firstRow: firstRowData ? firstRowData.textContent.trim() : 'N/A',
      lastRowLastColumn: lastRowData ? lastRowData.textContent.trim() : 'N/A',
    };

    tableDataArray.push(rowData);
  });

  return tableDataArray;
};

const processPendingChallans = (tableData) => {
  return tableData
    .filter((table) => table.lastRowLastColumn === 'StatusPending')
    .map((table) => table.firstRow);
};

const scrapeWebsiteData = async (vehicle) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || null,
    args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();

  const url = `https://carinfo.app/challan-details/${vehicle}`;
  await page.goto(url);

  await page.waitForSelector('h2.Challan-details-heading');

  const { numberOfChallans, tableData } = await page.evaluate(() => {
    function findNumericValues(str) {
      const numericValues = str.match(/\d+(\.\d+)?/g);
      return numericValues ? numericValues.map(Number) : [];
    }

    function extractTableData(tables) {
      const tableDataArray = [];
      tables.forEach((table) => {
        const firstRowData = table.querySelector('tr:first-child td');
        const lastRowData = table.querySelector('tr:last-child td:last-child');
        const rowData = {
          firstRow: firstRowData ? firstRowData.textContent.trim() : 'N/A',
          lastRowLastColumn: lastRowData ? lastRowData.textContent.trim() : 'N/A',
        };
        tableDataArray.push(rowData);
      });
      return tableDataArray;
    }

    const tables = document.querySelectorAll('table.md\\:hidden');
    const tableData = extractTableData(tables);
    const challanDetailsHeading = document.querySelector('h2.Challan-details-heading').textContent.trim();
    const Challans = findNumericValues(challanDetailsHeading);
    const numberOfChallans = Challans[0] || 0;

    return { numberOfChallans, tableData };
  });

  const pendingChallan = processPendingChallans(tableData);

  await browser.close();
  return { pendingChallan, numberOfChallans };
};




const Mail = async (vehicle, email) => {
  try {
    const { pendingChallan, numberOfChallans } = await scrapeWebsiteData(vehicle);

    if (pendingChallan.length > 0) {
      const currentTime = Date.now();
      const currentDate = new Date(currentTime);
      const formattedTime = currentDate.toLocaleTimeString();
      const formattedDate = currentDate.toDateString();

      const emailResponse = await sendEmail(email, vehicle, pendingChallan, formattedDate, formattedTime);
      return emailResponse;
    } else {
      return 'No pending challans.';
    }
  } catch (error) {
    console.error('Error:', error.message);
    return error.message;
  }
};

export default Mail;
