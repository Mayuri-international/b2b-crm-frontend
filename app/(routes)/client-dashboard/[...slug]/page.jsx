'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { useState } from 'react';

import { Textarea } from '@/components/ui/textarea';

import { Input } from '@/components/ui/input';

// Dummy client detail for display
const clientSpecificData = {
  id: 'c2',
  name: 'Meena Desai',
  email: 'meena@mayuri.com',
  phone: '9988776655',
  platform: 'Facebook',
  website: 'mayurifinserv.com',
  requirement: '10 Cafe Chairs for new cafe branch in Bangalore',
  status: 'Assigned',
  assignedTo: 'Sadiq Basha',
  assignmentDate: '2023-10-02',
  attachments: ['https://api.dicebear.com/5.x/initials/svg?seed=Chava Srinadh', 'https://res.cloudinary.com/dh4uhkvrf/image/upload/v1745909334/signed_offer_letters/m6emaywxstxerxzwq7om.pdf'],
  activityLog: [
    '2023-10-03: Called client, sent product catalog.',
    '2023-10-02: Assigned to Sadiq.',
    '2023-10-01: Query received from Facebook.',
    "2023-09-30: toady not responded properly and told to call back tomorrow"
  ],
  notesByAdmin: [

    {

      title: "These are clients very crucial for us",
      date: "2023-10-01",
    },
    {

      title: "These are clients very crucial for us",
      date: "2023-10-01",

    },
    {

      title: "These are clients very crucial for us",
      date: "2023-10-01",
    },
    {

      title: "These are clients very crucial for us",
      date: "2023-10-01",

    }

  ],

  followUps: [

    {
      nextDate: "2023-10-01",
      reason: "call back tomorrow",
      status: "Pending",
      updatedBy: "Sadiq",

    },
    {
      nextDate: "2023-10-01",
      reason: "call back tomorrow",
      status: "Pending",
      updatedBy: "Sadiq",

    }

  ]

};

export default function ClientDetailPage() {
  const { id } = useParams();

  const [note, setNote] = useState('');

  const [clientData, setClientData] = useState(clientSpecificData);

  const [selectedDocumentData, setSelectedDocumentData] = useState('');

  // const [newFollowUpData, setNewFollowUpData] = useState(null);

  const  [nextFollowUpData, setNextFollowUpData] = useState({

    nextDate: Date.now(),
    reason: "",
    status:"Pending",
    updatedBy:"Sadiq",

  });


  function addNoteHandler(note) {

    if (note.trim().length === 0) return

    const newNote = {

      title: note,
      date: new Date().toISOString(),

    }

    // add this new note to the clientData.notesByAdmin array

    setClientData(prevData => ({
      ...prevData,
      notesByAdmin: [...prevData.notesByAdmin, newNote]
    }))

    setNote('');

  }

  function selectDocumentHandler(data) {

    setSelectedDocumentData(data);

  }


  function nextFollowupChangeHanler(e){

    const value = e.target.value;

    console.log("next followup change handler ", value);

    setNextFollowUpData(prevData => ({
      ...prevData,
      [e.target.name]: value
    }));

  }

  function addNewFollowUpHandler() {

    if(!nextFollowUpData.nextDate || !nextFollowUpData.reason) return;

    const prepareData = {

      nextDate: nextFollowUpData.nextDate,
      reason: nextFollowUpData.reason,
      status: nextFollowUpData.status,
      updatedBy: nextFollowUpData.updatedBy,
    }

    setClientData(prevData => ({
      ...prevData,
      followUps: [...prevData.followUps, prepareData]
    }));


    setNextFollowUpData((prevData) => ({
      ...prevData,
      reason: "",
    }));

  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Client: {clientData.name}</CardTitle>
            <p className="text-muted-foreground">Email: {clientData.email}</p>
            <p className="text-muted-foreground">Phone: {clientData.phone}</p>
            <p className="text-muted-foreground">Platform: {clientData.platform} | Website: {clientData.website}</p>
          </div>
          <Badge variant="default">{clientData.status}</Badge>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="followup">followup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Requirement</CardTitle>
            </CardHeader>
            <CardContent>{clientData.requirement}</CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><Label>Assigned To:</Label> {clientData.assignedTo}</div>
                <div><Label>Assignment Date:</Label> {clientData.assignmentDate}</div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes / Comments</CardTitle>
            </CardHeader>

            <div className='flex flex-col gap-3 p-5'>

              <Label>Notes By Admin</Label>

              <div className='flex flex-col gap-3'>

                {clientData.notesByAdmin.map((note, idx) => (

                  <div key={idx} className="bg-slate-200 p-4 rounded-xl gap-2 w-[80%]">

                    <p>{note.title}</p>
                    <p>{note.date}</p>

                  </div>

                ))}

              </div>

            </div>

            <CardContent>

              {

                clientData.notesByAdmin.length > 0 &&
                <p className="text-muted-foreground">No notes added yet. (To be implemented with rich text editor or textarea)</p>

              }

              {/* <RichTextEditor onChange={setNote} value={note}></RichTextEditor> */}

              <div className='flex flex-col gap-5 p-3'>

                <Textarea className="max-h-96" onChange={(e) => setNote(e.target.value)} value={note} />

                <Button onClick={() => addNoteHandler(note)}>Add Note</Button>

              </div>

            </CardContent>

          </Card>
        </TabsContent>

        <TabsContent value="attachments">
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>

            <div className='flex justify-between flex-col relative gap-9'>

              <div className='w-full relative'>

                <CardContent className="relative w-full">
                  <div className="list-disc list-inside relative w-full">
                    {clientData.attachments.map((file, idx) => (
                      <p key={idx} className="text-blue-600 cursor-pointer text-wrap" onClick={() => selectDocumentHandler(file)}>{file}</p>
                    ))}
                  </div>
                </CardContent>

              </div>

              {

                clientData.attachments.length > 0 && selectedDocumentData !== '' && <div>

                  <div className='w-full px-5 pb-5'>

                    <iframe src={selectedDocumentData} width="80%" className='min-h-[400px]' frameborder="0"></iframe>

                  </div>

                </div>

              }

            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40">
                <ul className="list-disc list-inside space-y-1">
                  {clientData.activityLog.map((entry, idx) => (
                    <li key={idx}>{entry}</li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followup">

          {/* recent followups */}

          <div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Followups</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className=" h-fit max-h-96">

                  <div>

                    <div className='flex flex-col gap-3.5'>

                      {

                        clientData.followUps.map((entry, idx) => (
                          <div key={idx} className="bg-slate-200 p-4 rounded-xl gap-2 w-[80%]">
                            <p>{entry.reason}</p>
                            <p>{entry.nextDate}</p>
                            <p>{entry.status}</p>
                          </div>
                        ))
                      }

                    </div>

                  </div>
                </ScrollArea>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle>Follow Up</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col w-full">

                <div className='flex flex-col gap-3'>

                  <Label>Next Follow-Up Date</Label>
                  <Input type="date" className="w-fit" name="nextDate" value={nextFollowUpData.nextDate} onChange={nextFollowupChangeHanler}/>

                </div>

                <div className='flex flex-col gap-3'>

                  <Label className="mt-4">Reason / Note</Label>
                  <Textarea name="reason" value={nextFollowUpData.reason} onChange={nextFollowupChangeHanler}/>

                </div>

                <Button className="mt-4 w-fit" onClick={addNewFollowUpHandler}>Save Reminder</Button>

              </CardContent>

            </Card>

          </div>



        </TabsContent>

      </Tabs>
    </div>
  );
}


