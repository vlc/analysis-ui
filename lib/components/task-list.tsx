import {
  Box,
  Button,
  Heading,
  HStack,
  Progress,
  Stack,
  StackDivider
} from '@chakra-ui/react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

import {CheckIcon, ExternalLinkIcon} from 'lib/components/icons'
import {ALink} from 'lib/components/link'
import useActivity from 'lib/hooks/use-activity'
import useRouteTo from 'lib/hooks/use-route-to'
import {secondsToHhMmSsString} from 'lib/utils/time'

// Default paddings shared across components in the task list
const px = 3
const py = 4

const taskIsFinished = (t: CL.Task) => t.state === 'DONE' || t.state === 'ERROR'

function getColor(task: CL.Task): string {
  switch (task.state) {
    case 'ACTIVE':
      return 'green.500'
    case 'ERROR':
      return 'red.500'
    case 'DONE':
      return 'blue.500'
  }
}

const formatComplete = (secondsComplete: number): string =>
  formatDistanceToNow(Date.now() - secondsComplete * 1_000, {addSuffix: true})

/**
 * Simple component for displaying the time and updating it every second.
 */
function TaskTime({task}: {task: CL.Task}) {
  const {secondsActive, secondsComplete, state} = task
  const [taskState, setTaskState] = useState(task.state)
  const [taskSeconds, setTaskSeconds] = useState(
    taskState === 'ACTIVE' ? secondsActive : secondsComplete
  )

  // Always increment by 1 second
  useEffect(() => {
    const id = setInterval(() => setTaskSeconds((t) => t + 1), 1_000)
    return () => clearInterval(id)
  }, [])

  // Change the base time if the state changes
  useEffect(() => {
    if (taskState !== state) {
      setTaskState(state)
      setTaskSeconds(secondsComplete)
    }
  }, [secondsComplete, state, taskState])

  return (
    <>
      {taskState === 'ACTIVE'
        ? secondsToHhMmSsString(taskSeconds)
        : formatComplete(taskSeconds)}
    </>
  )
}

function getLinkKey(workProduct: CL.TaskWorkProduct) {
  switch (workProduct.type) {
    case 'BUNDLE':
      return 'bundle'
    case 'REGIONAL_ANALYSIS':
      return 'regionalAnalysis'
    case 'RESOURCE':
      return 'resource'
  }
}

function getLinkParams(workProduct: CL.TaskWorkProduct) {
  switch (workProduct.type) {
    case 'BUNDLE':
      return {
        bundleId: workProduct.id,
        regionId: workProduct.regionId
      }
    case 'REGIONAL_ANALYSIS':
      return {
        regionalAnalysisId: workProduct.id,
        regionId: workProduct.regionId
      }
    case 'RESOURCE':
      return {
        resourceId: workProduct.id,
        regionId: workProduct.regionId
      }
  }
}

function LinkToWorkProduct(p: {
  removeTask: (id: string) => void
  task: CL.Task
}) {
  const goToWorkProduct = useRouteTo(
    getLinkKey(p.task.workProduct),
    getLinkParams(p.task.workProduct)
  )
  const text =
    p.task.state === 'ERROR' ? 'View error details' : 'View work product'
  return (
    <Button
      colorScheme={p.task.state === 'ERROR' ? 'red' : 'blue'}
      onClick={() => {
        goToWorkProduct()
        p.removeTask(p.task.id)
      }}
      px={3}
      rightIcon={<ExternalLinkIcon />}
      variant='ghost'
    >
      {text}
    </Button>
  )
}

interface TaskProps {
  removeTask: (id: string) => void
  task: CL.Task
}

function Task({removeTask, task, ...p}: TaskProps) {
  return (
    <Stack id={task.id} pl={px} py={py} position='relative' spacing={1} {...p}>
      <HStack justify='space-between'>
        <Heading
          color={getColor(task)}
          overflow='hidden'
          size='sm'
          textOverflow='ellipsis'
          title={task.title}
          whiteSpace='nowrap'
          _hover={{
            whiteSpace: 'normal'
          }}
        >
          {task.title}
        </Heading>
        <HStack spacing={1} pr={1}>
          {taskIsFinished(task) && task.workProduct && (
            <Box>
              <LinkToWorkProduct removeTask={removeTask} task={task} />
            </Box>
          )}
          <Button
            colorScheme='blue'
            onClick={() => removeTask(task.id)}
            px={3}
            rightIcon={<CheckIcon />}
            variant='ghost'
            visibility={taskIsFinished(task) ? 'inherit' : 'hidden'}
          >
            Clear
          </Button>
        </HStack>
      </HStack>
      <HStack justify='space-between' pr={px} spacing={6}>
        <Box
          textOverflow='ellipsis'
          whiteSpace='nowrap'
          overflow='hidden'
          _hover={{
            whiteSpace: 'normal'
          }}
        >
          {task.detail}
        </Box>
        <Box fontFamily='mono' opacity={0.6} whiteSpace='nowrap'>
          <TaskTime task={task} />
        </Box>
      </HStack>
      {task.state === 'ACTIVE' && (
        <Box>
          <Progress
            colorScheme='green'
            hasStripe
            isAnimated
            mt={2}
            value={task.percentComplete}
          />
        </Box>
      )}
    </Stack>
  )
}

interface TaskListProps {
  limit?: number
}

const queryAsString = (q: string | string[]): string =>
  Array.isArray(q) ? q[0] : q

export default function TaskList({limit}: TaskListProps) {
  const router = useRouter()
  const {tasks, removeTask} = useActivity()
  return (
    <Stack divider={<StackDivider />} id='TaskList' spacing={0}>
      {tasks.length > 0 ? (
        tasks
          .slice(0, limit)
          .map((task) => (
            <Task key={task.id} removeTask={removeTask} task={task} />
          ))
      ) : (
        <Box px={px} py={py}>
          No active tasks.
        </Box>
      )}
      {limit < tasks.length && (
        <Box px={px} py={py}>
          <ALink
            to='activity'
            query={{regionId: queryAsString(router.query.regionId)}}
          >
            View more tasks →
          </ALink>
        </Box>
      )}
    </Stack>
  )
}
