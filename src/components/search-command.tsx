'use client'

import { useState, useEffect } from 'react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useSearch } from '@/hooks/use-search'
