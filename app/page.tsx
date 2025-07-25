"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, RefreshCw } from "lucide-react"

// Function to convert escaped string to actual markdown
function parseEscapedString(escapedString: string): string {
  return escapedString
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\")
}

// Simple markdown parser for rendering
function parseMarkdown(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4 text-gray-900">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-6 text-gray-900">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Lists - handle nested lists
    .replace(/^\* {3}(.*$)/gim, '<li class="ml-8 mb-1 list-disc list-inside">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 list-disc list-inside">$1</li>')
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, "<br>")

  // Wrap in paragraphs
  html = '<p class="mb-4">' + html + "</p>"

  // Handle lists properly
  html = html.replace(/<\/p><p class="mb-4">(<li.*?<\/li>)/g, '<ul class="mb-4">$1')
  html = html.replace(/(<li.*?<\/li>)<\/p><p class="mb-4">/g, '$1</ul><p class="mb-4">')
  html = html.replace(/(<li.*?<\/li>)(<li.*?<\/li>)/g, "$1$2")

  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-4"><\/p>/g, "")
  html = html.replace(/<p class="mb-4">(<ul.*?<\/ul>)<\/p>/g, "$1")

  return html
}

export default function StringToMarkdownConverter() {
  const [inputString, setInputString] = useState(
    `"# 5. Sınıf Din Kültürü ve Ahlak Bilgisi: 2.2 Namazın Kılınışı\\n\\n### 1. Anahtar Kelimeler ve Temel Kavramlar\\n\\n*   Namaz: Akıllı ve ergenlik çağına girmiş her Müslüman'a günde beş vakit (sabah, öğle, ikindi, akşam, yatsı) farz olan bir ibadettir. Namaz, belirli vakitlerde, belirli hareketler ve dualarla yerine getirilen bedensel bir ibadettir ve kişinin Allah ile doğrudan iletişim kurmasını sağlar.\\n*   Rekât: Namazın her bir bölümüne verilen addır. Bir rekât, kıyam (ayakta durma), kıraat (Kur'an okuma), rükû (eğilme) ve iki secdeden (yere kapanma) oluşur. Namazlar rekât sayısına göre farklılık gösterir (örn. sabah namazı 2 rekât, öğle namazı 4 rekât).\\n*   İftitah Tekbiri: Namaza başlarken \\"Allahüekber\\" diyerek yapılan başlangıç tekbiridir. Bu tekbir ile kişi namaza niyetini pekiştirir ve dünyevi işlerden el çekerek ibadete odaklanır."`,
  )

  const [parsedMarkdown, setParsedMarkdown] = useState("")

  const convertString = () => {
    // Remove surrounding quotes if present
    let cleanString = inputString.trim()
    if (
      (cleanString.startsWith('"') && cleanString.endsWith('"')) ||
      (cleanString.startsWith("'") && cleanString.endsWith("'"))
    ) {
      cleanString = cleanString.slice(1, -1)
    }

    const converted = parseEscapedString(cleanString)
    setParsedMarkdown(converted)
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(parsedMarkdown)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([parsedMarkdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted-document.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInputString("")
    setParsedMarkdown("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">String to Markdown Converter</h1>
          <p className="text-gray-600 mt-1">Convert escaped strings (with \\n) to properly formatted markdown</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="flex flex-col h-[600px]">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Input String</h2>
              <div className="flex gap-2">
                <Button onClick={convertString} size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Convert
                </Button>
                <Button onClick={clearAll} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <Textarea
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                placeholder='Paste your escaped string here (e.g., "# Title\\n\\nContent with \\n newlines")'
                className="w-full h-full resize-none font-mono text-sm border-0 focus-visible:ring-0"
              />
            </div>
          </Card>

          {/* Output Panel */}
          <Card className="flex flex-col h-[600px]">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Rendered Markdown</h2>
              <div className="flex gap-2">
                <Button onClick={copyMarkdown} variant="outline" size="sm" disabled={!parsedMarkdown}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button onClick={downloadMarkdown} variant="outline" size="sm" disabled={!parsedMarkdown}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto bg-white">
              {parsedMarkdown ? (
                <div
                  className="prose prose-gray max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(parsedMarkdown) }}
                />
              ) : (
                <div className="text-gray-500 italic text-center mt-8">
                  Click "Convert" to see the rendered markdown
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Raw Markdown Panel */}
        {parsedMarkdown && (
          <Card className="mt-6">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-700">Converted Markdown (Editable)</h2>
            </div>
            <div className="p-4">
              <Textarea
                value={parsedMarkdown}
                onChange={(e) => setParsedMarkdown(e.target.value)}
                className="w-full h-64 font-mono text-sm"
                placeholder="Your converted markdown will appear here..."
              />
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Paste your escaped string in the input field (strings with \\n, \\t, etc.)</li>
              <li>Click "Convert" to process the string and render the markdown</li>
              <li>View the beautifully formatted result in the preview panel</li>
              <li>Edit the converted markdown in the editable text area if needed</li>
              <li>Copy or download the final markdown</li>
            </ol>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Example Input:</h4>
              <code className="text-sm text-blue-800 break-all">
                "# Title\\n\\n## Subtitle\\n\\n* Item 1\\n* Item 2"
              </code>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
