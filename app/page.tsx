'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button as MuiButton, Slider as MuiSlider } from '@mui/material';
import { ResponsiveLine } from "@nivo/line";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from "react";
import { clsx } from "clsx";

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });

export default function Home() {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [liftingSettings, setLiftingSettings] = useState({
    amountOfWater: 123345,
    liftingHeight: 123345,
    timeOfDay: { start: 5, end: 11 }
  });
  const [distributionSettings, setDistributionSettings] = useState({
    areaOfDistribution: 123345,
    depthOfDistribution: 123345,
    timeOfDay: { start: 5, end: 11 }
  });
  const [pressureSettings, setPressureSettings] = useState({
    amountOfWater: 123345,
    pressureRequired: 123345,
    timeOfDay: { start: 5, end: 11 }
  });
  const [solarSettings, setSolarSettings] = useState({
    netAreaOfActiveSolarPanels: 123345,
    solarPanelEfficiency: 123345,
    timeOfDay: { start: 5, end: 11 }
  });

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
  }

  interface LiftingSettings {
    amountOfWater: number;
    liftingHeight: number;
    timeOfDay: { start: number; end: number };
  }

  interface DistributionSettings {
    areaOfDistribution: number;
    depthOfDistribution: number;
    timeOfDay: { start: number; end: number };
  }

  interface PressureSettings {
    amountOfWater: number;
    pressureRequired: number;
    timeOfDay: { start: number; end: number };
  }

  interface SolarSettings {
    netAreaOfActiveSolarPanels: number;
    solarPanelEfficiency: number;
    timeOfDay: { start: number; end: number };
  }

  const handleSettingsChange = (setting: string, value: any) => {
    // Update the appropriate state based on the setting
    switch (setting) {
      case 'liftingSettings':
        setLiftingSettings(value as LiftingSettings);
        break;
      case 'distributionSettings':
        setDistributionSettings(value as DistributionSettings);
        break;
      case 'pressureSettings':
        setPressureSettings(value as PressureSettings);
        break;
      case 'solarSettings':
        setSolarSettings(value as SolarSettings);
        break;
      default:
        break;
    }
  }

  const handleApply = async () => {
    try {
      // Send the settings to the API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          liftingSettings,
          distributionSettings,
          pressureSettings,
          solarSettings
        })
      })

      if (response.ok) {
        console.log('Settings applied successfully')
      } else {
        console.error('Failed to apply settings')
      }
    } catch (error) {
      console.error('Error applying settings:', error)
    }
  }

  const handleSliderChange = (setting: string, newValue: number[]) => {
    if (Array.isArray(newValue)) {
      const [start, end] = newValue;
      handleSettingsChange(setting, {
        ...getSettingsFromString(setting),
        timeOfDay: { start, end }
      });
    }
  }

  const getSettingsFromString = (setting: string) => {
    switch (setting) {
      case 'liftingSettings':
        return liftingSettings;
      case 'distributionSettings':
        return distributionSettings;
      case 'pressureSettings':
        return pressureSettings;
      case 'solarSettings':
        return solarSettings;
      default:
        return {};
    }
  }

  return (
    <div className="bg-[#0d1117] text-white min-h-screen p-8 md:p-12 lg:p-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-[#161b22] p-4 rounded-lg">
          <CardHeader>
            <CardTitle>Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px]">
            <MapContainer center={[position[0], position[1]]} zoom={13} scrollWheelZoom={false} style={{ height: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </MapContainer>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#161b22]">
            <CardHeader>
              <CardTitle className="text-white">LIFTING SETTINGS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="amount-water" className="text-white">
                  Amount of Water
                </Label>
                <Input id="amount-water" value={liftingSettings.amountOfWater} onChange={(e) => handleSettingsChange('liftingSettings', { ...liftingSettings, amountOfWater: Number(e.target.value) })} className="text-white bg-[#161b22]" />
                <Label htmlFor="lifting-height" className="text-white">
                  Lifting Height
                </Label>
                <Input id="lifting-height" value={liftingSettings.liftingHeight} onChange={(e) => handleSettingsChange('liftingSettings', { ...liftingSettings, liftingHeight: Number(e.target.value) })} className="text-white bg-[#161b22]" />
                <div className="flex items-center gap-2">
                  <Label htmlFor="time-of-day-lifting" className="text-white">
                    Time of Day
                  </Label>
                  <MuiSlider
                    id="time-of-day-lifting"
                    value={[liftingSettings.timeOfDay.start, liftingSettings.timeOfDay.end]}
                    onChange={(e, value) => handleSliderChange('liftingSettings', value as number[])}
                    min={0}
                    max={24}
                    step={1}
                    valueLabelDisplay="auto"
                    className={clsx('w-full', 'bg-transparent')}
                    sx={{
                      color: 'white',
                      '& .MuiSlider-rail': {color: 'white'
                      },
                      '& .MuiSlider-track': {
                        color: 'blue'
                      },
                      '& .MuiSlider-thumb': {
                        color: 'blue'
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#161b22]">
            <CardHeader>
              <CardTitle className="text-white">DISTRIBUTION SETTINGS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="area-distribution" className="text-white">
                  Area of Distribution
                </Label>
                <Input id="area-distribution" value={distributionSettings.areaOfDistribution} onChange={(e) => handleSettingsChange('distributionSettings', { ...distributionSettings, areaOfDistribution: Number(e.target.value) })} className="text-white bg-[#161b22]" />
                <Label htmlFor="depth-distribution" className="text-white">
                  Depth of Distribution
                </Label>
                <Input id="depth-distribution" value={distributionSettings.depthOfDistribution} onChange={(e) => handleSettingsChange('distributionSettings', { ...distributionSettings, depthOfDistribution: Number(e.target.value) })} className="text-white bg-[#161b22]" />
                <div className="flex items-center gap-2">
                  <Label htmlFor="time-of-day-distribution" className="text-white">
                    Time of Day
                  </Label>
                  <MuiSlider
                    id="time-of-day-distribution"
                    value={[distributionSettings.timeOfDay.start, distributionSettings.timeOfDay.end]}
                    onChange={(e, value) => handleSliderChange('distributionSettings', value as number[])}
                    min={0}
                    max={24}
                    step={1}
                    valueLabelDisplay="auto"
                    className="w-full bbg-transparent"
                    sx={{
                      color: 'white',
                      '& .MuiSlider-rail': {
                        color: 'white'
                      },
                      '& .MuiSlider-track': {
                        color: 'blue'
                      },
                      '& .MuiSlider-thumb': {
                        color: 'blue'
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-[#161b22]">
          <CardHeader>
            <CardTitle className="text-white">PRESSURIZATION SETTINGS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="amount-water-pressurization" className="text-white">
                Amount of Water
              </Label>
              <Input id="amount-water-pressurization" value={pressureSettings.amountOfWater} onChange={(e) => handleSettingsChange('pressureSettings', { ...pressureSettings, amountOfWater: Number(e.target.value) })} className="text-white bg-[#161b22]" />
              <Label htmlFor="pressurization-required" className="text-white">
                Pressurization required
              </Label>
              <Input id="pressurization-required" value={pressureSettings.pressureRequired} onChange={(e) => handleSettingsChange('pressureSettings', { ...pressureSettings, pressureRequired: Number(e.target.value) })} className="text-white bg-[#161b22]" />
              <div className="flex items-center gap-2">
                <Label htmlFor="time-of-day-pressurization" className="text-white">
                  Time of Day
                </Label>
                <MuiSlider
                  id="time-of-day-pressurization"
                  value={[pressureSettings.timeOfDay.start, pressureSettings.timeOfDay.end]}
                  onChange={(e, value) => handleSliderChange('pressureSettings', value as number[])}
                  min={0}
                  max={24}
                  step={1}
                  valueLabelDisplay="auto"
                  className="w-full bg-transparent"
                  sx={{
                    color: 'white',
                    '& .MuiSlider-rail': {
                      color: 'white'
                    },
                    '& .MuiSlider-track': {
                      color: 'blue'
                    },
                    '& .MuiSlider-thumb': {
                      color: 'blue'
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#161b22]">
          <CardHeader>
            <CardTitle className="text-white">SOLAR PANEL SETTINGS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="net-area" className="text-white">
                Net Area of Active Solar Panels
              </Label>
              <Input id="net-area" value={solarSettings.netAreaOfActiveSolarPanels} onChange={(e) => handleSettingsChange('solarSettings', { ...solarSettings, netAreaOfActiveSolarPanels: Number(e.target.value) })} className="text-white bg-[#161b22]" />
              <Label htmlFor="solar-panel-efficiency" className="text-white">
                Solar Panel Efficiency
              </Label>
              <Input id="solar-panel-efficiency" value={solarSettings.solarPanelEfficiency} onChange={(e) => handleSettingsChange('solarSettings', { ...solarSettings, solarPanelEfficiency: Number(e.target.value) })} className="text-white bg-[#161b22]" />
              <div className="flex items-center gap-2">
                <Label htmlFor="time-of-day-solar" className="text-white">
                  Time of Day
                </Label>
                <MuiSlider
                  id="time-of-day-solar"
                  value={[solarSettings.timeOfDay.start, solarSettings.timeOfDay.end]}
                  onChange={(e, value) => handleSliderChange('solarSettings', value as number[])}
                  min={0}
                  max={24}
                  step={1}
                  valueLabelDisplay="auto"
                  className="w-full bg-transparent"
                  sx={{
                    color: 'white',
                    '& .MuiSlider-rail': {
                      color: 'white'
                    },
                    '& .MuiSlider-track': {
                      color: 'blue'
                    },
                    '& .MuiSlider-thumb': {
                      color: 'blue'
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <MuiButton variant="outlined" color="primary" className="text-white bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600">
            HOURLY
          </MuiButton>
          <MuiButton variant="outlined" color="primary" className="text-white bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600">
            DAILY
          </MuiButton>
          <MuiButton variant="outlined" color="primary" className="text-white bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600">
            MONTHLY
          </MuiButton>
        </div>
        <MuiButton variant="contained" color="primary" onClick={handleApply} className="text-white bg-blue-500 hover:bg-blue-600">
          APPLY
        </MuiButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px] text-white" />
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
        <LineChart className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
      </div>
    </div>
  )
}

function LineChart({ className }: { className: string }) {
  return (
    <div className={className}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#ffffff", // Set tick text color to white
              },
            },
          },
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}