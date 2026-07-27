import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, instagram, followers, niche, experience, contentStrategy, portfolio, type } = body

    // Basic validation
    if (!name || !email || !instagram || !followers || !niche || !experience || !contentStrategy) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    // Simple email validation
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Email content with better formatting
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New BELLVION Influencer Application</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: #000; color: #CBA135; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .section { margin-bottom: 20px; padding: 15px; background: white; border-left: 4px solid #CBA135; }
        .label { font-weight: bold; color: #CBA135; }
        .footer { background: #000; color: #CBA135; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BELLVION - New Influencer Application</h1>
    </div>
    
    <div class="content">
        <div class="section">
            <p><span class="label">Application Type:</span> ${type}</p>
            <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="section">
            <h3>Applicant Information</h3>
            <p><span class="label">Name:</span> ${name}</p>
            <p><span class="label">Email:</span> ${email}</p>
            <p><span class="label">Instagram:</span> ${instagram}</p>
            <p><span class="label">Followers:</span> ${followers}</p>
            <p><span class="label">Content Niche:</span> ${niche}</p>
        </div>
        
        <div class="section">
            <h3>Experience & Strategy</h3>
            
            <h4>Brand Experience:</h4>
            <p>${experience}</p>
            
            <h4>Content Strategy:</h4>
            <p>${contentStrategy}</p>
            
            ${portfolio ? `<h4>Portfolio:</h4><p>${portfolio}</p>` : ""}
        </div>
    </div>
    
    <div class="footer">
        <p>BELLVION — Because Legacy Is Not Bought. It's Ascended.</p>
        <p>Email: comercial@bellviion.store</p>
    </div>
</body>
</html>
    `

    // Log the application
    console.log("=== NEW BELLVION INFLUENCER APPLICATION ===")
    console.log(`Name: ${name}`)
    console.log(`Email: ${email}`)
    console.log(`Instagram: ${instagram}`)
    console.log(`Followers: ${followers}`)
    console.log(`Niche: ${niche}`)
    console.log(`Experience: ${experience}`)
    console.log(`Content Strategy: ${contentStrategy}`)
    console.log(`Portfolio: ${portfolio}`)
    console.log(`Target Email: comercial@bellviion.store`)
    console.log(`Submitted: ${new Date().toISOString()}`)
    console.log("===============================================")

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing influencer application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
