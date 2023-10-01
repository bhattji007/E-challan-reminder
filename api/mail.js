import puppeteer from "puppeteer";
import nodemailer from 'nodemailer';

function findNumericValues(str) {
  // Use a regular expression to find numeric values
  const numericValues = str.match(/\d+(\.\d+)?/g);

  return numericValues ? numericValues.map(Number) : [];
}

const Mail = async (vehicle, email) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_BIN || null,
      args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    const url = `https://carinfo.app/challan-details/${vehicle}`;
    await page.goto(url);

    // Wait for the element to become visible
    await page.waitForSelector('h2.Challan-details-heading');

    const challanDetailsHeading = await page.$eval('h2.Challan-details-heading', element => element.textContent.trim());
    const Challans = findNumericValues(challanDetailsHeading);
    const numberOfChallans = Challans[0];

    if (numberOfChallans) {
      // Get details from the table
      const tableData = await page.evaluate(() => {
        const tables = document.querySelectorAll('table.md\\:hidden'); // Escape special characters in class name

        const tableDataArray = [];

        tables.forEach((table) => {
          const firstRowData = table.querySelector('tr:first-child td');
          const lastRowData = table.querySelector('tr:last-child td:last-child');

          const rowData = {
            firstRow: firstRowData ? firstRowData.textContent.trim() : 'N/A',
            lastRowLastColumn: lastRowData ? lastRowData.textContent.trim() : 'N/A'
          };

          tableDataArray.push(rowData);
        });

        console.log('Table data:', tableDataArray);
        return tableDataArray;
      });

      const pendingChallan = tableData.filter(table => table.lastRowLastColumn === 'StatusPending').map(table => table.firstRow);

      console.log('=========>', pendingChallan, email);
      if (pendingChallan.length > 0) {
        // Send email here
        let testAccount = await nodemailer.createTestAccount();
        // Set up a transporter using your email service credentials
        let transporter = await nodemailer.createTransport({
          service: "gmail", // Corrected host value
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
        const currentTime = Date.now();
        const currentDate = new Date(currentTime);
        const formattedTime = currentDate.toLocaleTimeString();
        const formattedDate = currentDate.toDateString();
        const mailOptions = {
          from: 'challanDeets@gmail.com',
          to: `${email}`,
          subject: 'Vehicle Information and Pending Challans',
          text: `Dear User: ${email} ,\n\n
            We hope this email finds you well.\n
            We are writing to provide you with important information regarding your vehicle \n
            and any pending challans associated with it. Below are the details:\n\n
            Vehicle Information:\n\
            Vehicle Number: ${vehicle}\n\n
            Pending Challans: \n\
            Number of Pending Challans:${pendingChallan.length}\n
            ChallanID : ${pendingChallan}\n
            This Mail wast sent on ${formattedDate} at ${formattedTime} \n
            Thank you for your attention to this matter.\n\n
            Sincerely, \n
            E-Challan Reminder`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        await browser.close();
        return 'Email sent successfully!';
      } else {
        await browser.close();
        return 'No pending challans.';
      }
    } else {
      console.log("hit");
      await browser.close();
      return 'Challan details not found.';
    }
  } catch (e) {
    console.error('Error:', e);
    return 'An error occurred while sending the email.';
  }
};

export default Mail;