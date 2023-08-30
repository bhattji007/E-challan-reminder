import puppeteer from "puppeteer";
import nodemailer from 'nodemailer';

const Mail = async (vehicle, email) => {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    const url = `https://carinfo.app/challan-details/${vehicle}`;
    await page.goto(url);
  
    // Wait for the element to become visible
    await page.waitForSelector('h2.Challan-details-heading');
  
    const challanDetailsHeading = await page.$eval('h2.Challan-details-heading', element => element.textContent.trim());
  
    if (challanDetailsHeading !== 'Challans') {
      // Get details from the table
      const tableData = await page.evaluate(() => {
        const table = document.querySelector('table.md\\:hidden'); // Escape special characters in class name
        const firstRowData = table.querySelector('tr:first-child td');
        const lastRowData = table.querySelector('tr:last-child td:last-child');
        return {
          firstRow: firstRowData.textContent.trim(),
          lastRowLastColumn: lastRowData.textContent.trim()
        };
      });
          console.log('================================',tableData);
      if (tableData?.lastRowLastColumn==='StatusPending') {
        // Send email here
        let testAccount = await nodemailer.createTestAccount();      
        // Set up a transporter using your email service credentials
        let transporter = await nodemailer.createTransport({
          service: "gmail", // Corrected host valu
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
        
        const mailOptions = {
          from: 'challanDeets@gmail.com',
          to: `${email}`,
          subject: 'Challan Details Alert',
          text: `Challan details heading: ${challanDetailsHeading}\n  ${tableData.firstRow} ${tableData.lastRowLastColumn}`
        };
        
         transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            
            console.log('Error sending email:', error);
            return error;
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }
    }
  
    // Don't close the browser immediately if you want to see the window
    await browser.close();
  })();
};

export default Mail;